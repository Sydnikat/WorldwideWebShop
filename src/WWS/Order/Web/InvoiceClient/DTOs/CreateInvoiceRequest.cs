using Domain.Orders;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Domain.Orders.Order;

namespace Web.InvoiceClient.DTOs
{
    public class CreateInvoiceRequest
    {
        public CreateInvoiceRequest()
        {
        }

        public CreateInvoiceRequest(
            Guid orderCode,
            string customerId,
            string customerName,
            double totalPrice,
            ICollection<OrderItemRequest> items,
            string created, 
            OrderState state, 
            string zip,
            string city, 
            string street,
            string countryCode, 
            string email,
            string phone)
        {
            OrderCode = orderCode;
            CustomerId = customerId;
            CustomerName = customerName;
            TotalPrice = totalPrice;
            Items = items;
            Created = created;
            State = state;
            Zip = zip;
            City = city;
            Street = street;
            CountryCode = countryCode;
            Email = email;
            Phone = phone;
        }

        [JsonProperty(PropertyName = "orderCode")]
        public Guid OrderCode { get; set; }

        [JsonProperty(PropertyName = "customerId")]
        public string CustomerId { get; set; }

        [JsonProperty(PropertyName = "customerName")]
        public string CustomerName { get; set; }

        [JsonProperty(PropertyName = "totalPrice")]
        public double TotalPrice { get; set; }

        [JsonProperty(PropertyName = "items")]
        public ICollection<OrderItemRequest> Items { get; set; }

        [JsonProperty(PropertyName = "created")]
        public string Created { get; set; }

        [JsonProperty(PropertyName = "state")]
        public OrderState State { get; set; }

        [JsonProperty(PropertyName = "zip")]
        public string Zip { get; set; }

        [JsonProperty(PropertyName = "city")]
        public string City { get; set; }

        [JsonProperty(PropertyName = "street")]
        public string Street { get; set; }

        [JsonProperty(PropertyName = "countryCode")]
        public string CountryCode { get; set; }

        [JsonProperty(PropertyName = "email")]
        public string Email { get; set; }

        [JsonProperty(PropertyName = "phone")]
        public string Phone { get; set; }

        public static CreateInvoiceRequest Of(Order order)
            => new CreateInvoiceRequest(
                orderCode: order.OrderCode,
                customerId: order.CustomerId,
                customerName: order.CustomerName,
                totalPrice: order.TotalPrice,
                items: order.Items.Select(i => OrderItemRequest.Of(i)).ToList(),
                created: order.Created.ToString(Common.DTOs.Converters.DateTimeConverter.readFormat, null),
                state: order.State,
                zip: order.Zip,
                street: order.Street,
                city: order.City,
                countryCode: order.CountryCode,
                email: order.Email,
                phone: order.Phone
                );
    }
}
