using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.IntegrationEvents
{
    public class OrderItem
    {
        public long ItemId { get; set; }
        public int Count { get; set; }
    }

    public class OrderCreatedEvent : IOrderCreatedEvent
    {
        public string OrderCode { get; set; }
        public string CustomerId { get; set; }
        public List<OrderItem> Items { get; set; }
    }

    public interface IOrderCreatedEvent
    {
        public string OrderCode { get; set; }
        public string CustomerId { get; set; }
        public List<OrderItem> Items { get; set; }
    }
}
