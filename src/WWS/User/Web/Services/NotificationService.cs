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

            Console.WriteLine("creating new event...");

            var msg = JsonSerializer.Serialize(newEvent, Common.DTOs.JsonSerializationOptions.options);
            var body = Encoding.UTF8.GetBytes(msg);

            Console.WriteLine("msg serialized");

            var factory = new ConnectionFactory()
            {
                HostName = rabbimqSettings.Host,
                UserName = rabbimqSettings.Username,
                Password = rabbimqSettings.Password
            };

            using (var connection = factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                Console.WriteLine("channel created...");
                var props = channel.CreateBasicProperties();
                props.ContentType = "application/json";
                props.ContentEncoding = "UTF-8";
                props.DeliveryMode = 2;

                channel.QueueDeclare(queue: rabbimqSettings.MailQueue, durable: true, exclusive: false, autoDelete: false, arguments: null);
                Console.WriteLine("channel created...");

                channel.ExchangeDeclare(exchange: rabbimqSettings.Exchange, type: ExchangeType.Fanout, durable: true, autoDelete: false, arguments: null);
                Console.WriteLine("exchange created...");

                channel.BasicPublish(exchange: rabbimqSettings.Exchange, routingKey: rabbimqSettings.RoutingKey, basicProperties: props, body: body);
                Console.WriteLine("event published...");
            }

            return Task.CompletedTask;
        }

        public Task NotifyUsersForCategoryPromotion(List<Email> userEmails, CategoryDiscountCreatedEvent e)
        {
            const string writeFormat = Common.DTOs.Converters.DateTimeConverter.writeFormat;

            var newEvents = userEmails.Select(email => new CategoryPromotionCreatedEvent()
            {
                CategoryName = e.CategoryName,
                Discount = e.Discount,
                StartDate = e.StartDate.ToString(writeFormat),
                EndDate = e.EndDate.ToString(writeFormat),
                email = email.Value
            }).ToList();

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

                channel.QueueDeclare(queue: rabbimqSettings.CategoryPromotionQueue, durable: true, exclusive: false, autoDelete: false, arguments: null);

                newEvents.ForEach(newEvent =>
                {
                    var msg = JsonSerializer.Serialize(newEvent, Common.DTOs.JsonSerializationOptions.options);
                    var body = Encoding.UTF8.GetBytes(msg);
                    channel.BasicPublish(exchange: rabbimqSettings.CategoryPromotionExchange, routingKey: rabbimqSettings.CategoryPromotionRoutingkey, basicProperties: props, body: body);
                });
            }

            return Task.CompletedTask;
        }
    }
}
