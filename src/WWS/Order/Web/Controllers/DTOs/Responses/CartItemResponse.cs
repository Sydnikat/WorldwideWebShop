using Domain.Cart;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Controllers.DTOs.Responses
{
    public class CartItemResponse
    {
        public CartItemResponse(long itemId, string name, double price, int count)
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

        public static CartItemResponse Of(CartItem item)
            => new CartItemResponse(
                itemId: item.ItemId,
                name: item.Name,
                price: Math.Round(item.Price, 2),
                count: item.Count
                );
    }
}
