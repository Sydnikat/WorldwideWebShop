using Domain.Cart;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Cache;
using Web.Controllers.DTOs.Requests;
using Web.Controllers.DTOs.Responses;
using Web.InventoryClient;
using static HWS.Middlewares.ErrorHandlerMiddleware;

namespace Web.Controllers
{
    [Route("api/carts")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly CartsCache cache;
        private readonly IInventoryApiClient inventoryApiClient;

        public CartController(CartsCache cache, IInventoryApiClient inventoryApiClient)
        {
            this.cache = cache;
            this.inventoryApiClient = inventoryApiClient;
        }

        [HttpGet("me")]
        public async Task<ActionResult<CartResponse>> GetMyCart()
        {
            var customerId = "demo";
            var cachedValue = await cache.TryGet(customerId);
            if (cachedValue != null)
            {
                return Ok(CartResponse.Of(cachedValue));
            }

            var newCart = new Cart(customerId);

            await cache.Set(newCart);

            return Ok(CartResponse.Of(newCart));
        }

        [HttpPut("me")]
        public async Task<ActionResult<CartResponse>> UpdateMyCart([FromBody] UpdateCartRequest request)
        {
            var customerId = "demo";
            var cart = await cache.TryGet(customerId);

            if (cart == null)
                cart = new Cart(customerId);

            if (request.Count <= 0)
                throw new WWSSException("Count must be positive", StatusCodes.Status400BadRequest);

            var item = await inventoryApiClient.GetInventoryItem(request.ItemId).ConfigureAwait(false);
            if (item == null)
                throw new WWSSException("Item not found", StatusCodes.Status404NotFound);

            if (request.Count > item.stock)
                throw new WWSSException("Count must be positive", StatusCodes.Status400BadRequest);

            var newCartItem = new CartItem(
                itemId: item.Id,
                name: item.Name,
                price: item.Price,
                count: request.Count
                );

            cart.Items.Add(newCartItem);

            await cache.Invalidate(customerId);
            await cache.Set(cart);

            return Ok(CartResponse.Of(cart));
        }
    }
}
