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
        public long Id { get; set; }
        public Guid OrderCode { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public float TotalPrice { get; set; }
        public ICollection<OrderItemResponse> Items { get; set; } = new List<OrderItemResponse>();
        public DateTime Created { get; set; }
        public OrderState State { get; set; }

        public OrderResponse(long id, Guid orderCode, string customerId, string customerName, float totalPrice, ICollection<OrderItem> items, DateTime created, OrderState state)
        {
            Id = id;
            OrderCode = orderCode;
            CustomerId = customerId;
            CustomerName = customerName;
            TotalPrice = totalPrice;
            Items = items.Select(OrderItemResponse.Of).ToList();
            Created = created;
            State = state;
        }

        public static OrderResponse Of(Order order)
            => new OrderResponse(
                id: order.Id,
                orderCode: order.OrderCode,
                customerId: order.CustomerId,
                customerName: order.CustomerName,
                totalPrice: order.TotalPrice,
                items: order.Items,
                created: order.Created,
                state: order.State
                );
    }
}
