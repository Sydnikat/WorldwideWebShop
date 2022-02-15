using Domain.Cart;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Controllers.DTOs.Responses
{
    public class CartResponse
    {
        public CartResponse(string customerId, double totalPrice, ICollection<CartItemResponse> items)
        {
            CustomerId = customerId;
            TotalPrice = totalPrice;
            Items = items;
        }

        public string CustomerId { get; set; }
        public double TotalPrice { get; set; }
        public ICollection<CartItemResponse> Items { get; set; } = new List<CartItemResponse>();

        public static CartResponse Of(Cart cart)
            => new CartResponse(
                customerId: cart.CustomerId,
                totalPrice: Math.Round(cart.TotalPrice, 2),
                items: cart.Items.Select(CartItemResponse.Of).ToList()
                );
    }
}
