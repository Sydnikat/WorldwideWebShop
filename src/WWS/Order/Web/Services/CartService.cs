using Domain.Cart;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Controllers.DTOs.Requests;
using Web.InventoryClient.DTOs;
using Web.Services.Exceptions;

namespace Web.Services
{
    public class CartService : ICartService
    {
        public Cart AddCartItem(Cart cart, InventoryItemResponse item, UpdateCartRequest request)
        {
            var cartItem = cart.Items.FirstOrDefault(i => i.ItemId == item.Id);
            var alreadyIn = false;

            if (cartItem != null)
            {
                alreadyIn = true;
                cartItem.Price = item.Price;
                cartItem.Count = request.Count;
            }
            else
            {
                cartItem = new CartItem(
                itemId: item.Id,
                name: item.Name,
                price: item.Price,
                count: request.Count
                );
            }

            if (cartItem.Count > item.Stock)
                throw new StockIsNotEnoughException(item.Id, item.Stock, request.Count);

            if (!alreadyIn)
                cart.Items.Add(cartItem);

            return cart;
        }
    }
}
