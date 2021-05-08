using Domain.Orders;
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

        public Task PublishOrderCreatedEvent(Order order)
        {
            var items = new List<OrderItem>();
            order.Items.ToList().ForEach(i =>
            {
                items.Add(new OrderItem
                {
                    ItemId = i.ItemId,
                    Count = i.Count
                });
            });

            var newEvent = new OrderCreatedEvent
            {
                CustomerId = order.CustomerId,
                OrderCode = order.OrderCode.ToString(),
                Items = items
            };

            var msg = JsonSerializer.Serialize(newEvent, Common.DTOs.JsonSerializationOptions.options);
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

                channel.QueueDeclare(queue: rabbimqSettings.orderCreatedQueue, durable: true, exclusive: false, autoDelete: false, arguments: null);
                channel.BasicPublish(exchange: rabbimqSettings.orderCreatedExchange, routingKey: rabbimqSettings.orderCreatedRoutingkey, basicProperties: props, body: body);
            }

            return Task.CompletedTask;
        }
    }
}
