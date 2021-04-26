using Domain.OrderItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Orders
{
    public class Order
    {
        public enum OrderState
        {
            InProgress,
            Billed
        }

        public Order(long id, Guid orderCode, string customerId, string customerName, float totalPrice, ICollection<OrderItem> items, DateTime created, OrderState state)
        {
            Id = id;
            OrderCode = orderCode;
            CustomerId = customerId;
            CustomerName = customerName;
            TotalPrice = totalPrice;
            Items = items;
            Created = created;
            State = state;
        }

        public long Id { get; set; }
        public Guid OrderCode { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public float TotalPrice { get; set; }
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
        public DateTime Created { get; set; }
        public OrderState State { get; set; }
    }
}
