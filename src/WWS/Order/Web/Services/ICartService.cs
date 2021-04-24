using Domain.Cart;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Controllers.DTOs.Requests;
using Web.InventoryClient.DTOs;

namespace Web.Services
{
    public interface ICartService
    {
        Cart AddCartItem(Cart cart,  InventoryItemResponse item, UpdateCartRequest request);
    }
}
