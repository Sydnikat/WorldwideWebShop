using Dal.Users;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Web.Config;
using Web.IntegrationEvents;

namespace Web.Services.Receivers
{
    public class CategoryDiscountCreationReceiver : BackgroundService
    {
        private readonly IUserRepository userRepository;
        private readonly IRabbimqSettings rabbimqSettings;
        private readonly INotificationService notificationService;
        private readonly IConnection _connection;
        private readonly IModel _channel;
        public CategoryDiscountCreationReceiver(IUserRepository userRepository, IRabbimqSettings rabbimqSettings, INotificationService notificationService)
        {
            this.userRepository = userRepository;
            this.rabbimqSettings = rabbimqSettings;
            this.notificationService = notificationService;

            var factory = new ConnectionFactory()
            {
                HostName = rabbimqSettings.Host,
                UserName = rabbimqSettings.Username,
                Password = rabbimqSettings.Password
            };

            _connection = factory.CreateConnection();
            _channel = _connection.CreateModel();

            _channel.QueueDeclare(queue: rabbimqSettings.CategoryDiscountQueue, durable: true, exclusive: false, autoDelete: false, arguments: null);
            _channel.QueueBind(queue: rabbimqSettings.CategoryDiscountQueue, exchange: rabbimqSettings.CategoryDiscountExchange, routingKey: rabbimqSettings.CategoryDiscountRoutingkey, arguments: null);
        }
        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            stoppingToken.ThrowIfCancellationRequested();

            var consumer = new EventingBasicConsumer(_channel);
            consumer.Received += async (ch, ea) =>
            {
                var content = Encoding.UTF8.GetString(ea.Body.ToArray());
                var categoryDiscountCreatedEvent = System.Text.Json.JsonSerializer.Deserialize<CategoryDiscountCreatedEvent>(content, Common.DTOs.JsonSerializationOptions.options);

                var emails = await userRepository.GetConfirmedEmails().ConfigureAwait(false);
                await notificationService.NotifyUsersForCategoryPromotion(emails, categoryDiscountCreatedEvent).ConfigureAwait(false);
                _channel.BasicAck(ea.DeliveryTag, false);
            };

            _channel.BasicConsume(rabbimqSettings.CategoryDiscountQueue, false, consumer);
  

            return Task.CompletedTask;
        }

        public override void Dispose()
        {
            _channel.Close();
            _connection.Close();
            base.Dispose();
        }
    }
}
