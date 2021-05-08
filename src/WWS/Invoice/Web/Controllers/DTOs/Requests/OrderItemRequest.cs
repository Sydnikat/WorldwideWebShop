using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Controllers.DTOs.Requests
{
    public class OrderItemRequest
    {
        public OrderItemRequest()
        {
        }

        public OrderItemRequest(long itemId, string name, double price, int count)
        {
            ItemId = itemId;
            Name = name;
            Price = price;
            Count = count;
        }

        public long ItemId { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public int Count { get; set; }
    }
}
