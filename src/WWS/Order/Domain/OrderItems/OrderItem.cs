using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.OrderItems
{
    public class OrderItem
    {
        public OrderItem(long id, long orderId, long itemId, string name, double price, int count)
        {
            _id = id;
            OrderId = orderId;
            ItemId = itemId;
            Name = name;
            Price = price;
            Count = count;
        }

        public long _id { get; set; }
        public long OrderId { get; set; }
        public long ItemId { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public int Count { get; set; }
    }
}
