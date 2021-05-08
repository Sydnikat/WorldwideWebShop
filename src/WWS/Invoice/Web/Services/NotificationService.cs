using Domain.Invoices;
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

        public Task PublishInvoiceCreatedEvent(Invoice invoice)
        {
            var newEvent = new InvoiceCreatedEvent
            {
                TotalPrice = invoice.TotalPrice,
                OrderCode = invoice.OrderCode.ToString(),
                Created = invoice.Created.ToString(Common.DTOs.Converters.DateTimeConverter.writeFormat, null),
                Zip = invoice.Zip,
                City = invoice.City,
                Street = invoice.Street,
                CountryCode = invoice.CountryCode,
                Email = invoice.Email
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

                channel.QueueDeclare(queue: rabbimqSettings.InvoiceCreatedQueue, durable: true, exclusive: false, autoDelete: false, arguments: null);
                channel.BasicPublish(exchange: rabbimqSettings.InvoiceCreatedExchange, routingKey: rabbimqSettings.InvoiceCreatedRoutingkey, basicProperties: props, body: body);
            }

            return Task.CompletedTask;
        }
    }
}
