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
using Web.Services;
using Web.Services.Exceptions;
using static HWS.Middlewares.ErrorHandlerMiddleware;

namespace Web.Controllers
{
    [Route("api/carts")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly CartsCache cache;
        private readonly IInventoryApiClient inventoryApiClient;
        private readonly ICartService cartService;

        public CartController(CartsCache cache, IInventoryApiClient inventoryApiClient, ICartService cartService)
        {
            this.cache = cache;
            this.inventoryApiClient = inventoryApiClient;
            this.cartService = cartService;
        }

        [HttpGet("me")]
        [ProducesResponseType(StatusCodes.Status200OK)]
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
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
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

            try
            {
                var updatedCart = cartService.AddCartItem(cart, item, request);

                await cache.Invalidate(customerId);
                await cache.Set(updatedCart);

                return Ok(CartResponse.Of(updatedCart));
            }
            catch (StockIsNotEnoughException)
            {
                throw new WWSSException("Not enough item in stock", StatusCodes.Status400BadRequest);
            }
            
        }

        [HttpDelete("me")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult> EmptyMyCart()
        {
            var customerId = "demo";
            await cache.Invalidate(customerId);
            return Ok();
        }
    }
}
