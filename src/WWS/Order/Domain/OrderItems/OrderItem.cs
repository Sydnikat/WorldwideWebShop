using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.OrderItems
{
    public class OrderItem
    {
        public OrderItem(long id, long orderId, long itemId, string name, float price, int count)
        {
            Id = id;
            OrderId = orderId;
            ItemId = itemId;
            Name = name;
            Price = price;
            Count = count;
        }

        public long Id { get; set; }
        public long OrderId { get; set; }
        public long ItemId { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public int Count { get; set; }
    }
}
