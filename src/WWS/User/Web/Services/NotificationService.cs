using Domain.Users;
using RabbitMQ.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Web.Config;
using Web.IntegrationEvents;

namespace Web.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IRabbimqSettings rabbimqSettings;

        private readonly JsonSerializerOptions options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public NotificationService(IRabbimqSettings rabbimqSettings)
        {
            this.rabbimqSettings = rabbimqSettings;
        }

        public Task PublishUserRegisteredEvent(User user)
        {
            var newEvent = new UserRegisteredEvent
            {
                UserId = user.Id.ToString(),
                UserName = user.UserName,
                Email = user.Email.Value
            };

            var msg = JsonSerializer.Serialize(newEvent, options);
            var body = Encoding.UTF8.GetBytes(msg);

            var factory = new ConnectionFactory()
            {
                HostName = rabbimqSettings.Host,
                UserName = rabbimqSettings.Username,
                Password = rabbimqSettings.Password
            };

            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                var props = channel.CreateBasicProperties();
                props.ContentType = "application/json";
                props.ContentEncoding = "UTF-8";
                props.DeliveryMode = 2;

                channel.QueueDeclare(queue: rabbimqSettings.MailQueue, durable: true, exclusive: false, autoDelete: false, arguments: null);
                channel.BasicPublish(exchange: rabbimqSettings.Exchange, routingKey: rabbimqSettings.RoutingKey, basicProperties: props, body: body);
            }

            return Task.CompletedTask;
        }
    }
}
