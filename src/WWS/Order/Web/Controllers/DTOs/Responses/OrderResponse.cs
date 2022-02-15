using Domain.OrderItems;
using Domain.Orders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Domain.Orders.Order;

namespace Web.Controllers.DTOs.Responses
{
    public class OrderResponse
    {
        public OrderResponse(
            long id, 
            Guid orderCode,
            string customerId,
            string customerName,
            double totalPrice,
            ICollection<OrderItem> items,
            DateTime created,
            OrderState state,
            string zip,
            string city,
            string street,
            string countryCode,
            string email,
            string phone)
        {
            Id = id;
            OrderCode = orderCode;
            CustomerId = customerId;
            CustomerName = customerName;
            TotalPrice = totalPrice;
            Items = items.Select(OrderItemResponse.Of).ToList();
            Created = created;
            State = state;
            State = state;
            Zip = zip;
            City = city;
            Street = street;
            CountryCode = countryCode;
            Email = email;
            Phone = phone;
        }

        public long Id { get; set; }
        public Guid OrderCode { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public double TotalPrice { get; set; }
        public ICollection<OrderItemResponse> Items { get; set; } = new List<OrderItemResponse>();
        public DateTime Created { get; set; }
        public OrderState State { get; set; }
        public string Zip { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string CountryCode { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public static OrderResponse Of(Order order)
            => new OrderResponse(
                id: order.Id,
                orderCode: order.OrderCode,
                customerId: order.CustomerId,
                customerName: order.CustomerName,
                totalPrice: Math.Round(order.TotalPrice, 2),
                items: order.Items,
                created: order.Created,
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
