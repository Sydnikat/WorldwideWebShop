using Domain.OrderItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Controllers.DTOs.Responses
{
    public class OrderItemResponse
    {
        public long Id { get; set; }
        public long ItemId { get; set; }
        public string Name { get; set; }
        public double Price { get; set; }
        public int Count { get; set; }

        public OrderItemResponse(long id, long itemId, string name, double price, int count)
        {
            Id = id;
            ItemId = itemId;
            Name = name;
            Price = price;
            Count = count;
        }

        public static OrderItemResponse Of(OrderItem item)
            => new OrderItemResponse(
                id: item.Id,
                itemId: item.ItemId,
                name: item.Name,
                price: Math.Round(item.Price, 2),
                count: item.Count
                );
    }
}
