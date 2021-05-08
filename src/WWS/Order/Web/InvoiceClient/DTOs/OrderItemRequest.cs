using Domain.OrderItems;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.InvoiceClient.DTOs
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

        [JsonProperty(PropertyName = "itemId")]
        public long ItemId { get; set; }

        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }

        [JsonProperty(PropertyName = "price")]
        public double Price { get; set; }

        [JsonProperty(PropertyName = "count")]
        public int Count { get; set; }

        public static OrderItemRequest Of(OrderItem item)
            => new OrderItemRequest(
                itemId: item.ItemId,
                name: item.Name,
                price: item.Price,
                count: item.Count
                );
    }
}
