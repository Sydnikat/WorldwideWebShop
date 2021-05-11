using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Controllers.Config;
using Web.Controllers.DTOs.Responses;
using Web.Services;
using Web.Services.Exceptions;
using static Web.Middlewares.ErrorHandlerMiddleware;

namespace Web.Controllers
{
    [Route("api/order/orders")]
    [ApiController]
    public class OrderController : WWSControllerBase
    {
        private readonly IOrderService orderService;

        public OrderController(IOrderService orderService)
        {
            this.orderService = orderService;
        }

        [HttpPost("{orderCode}/finish")]
        [Authorize(policy: "Customer")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrderResponse>> FinishOrder(Guid orderCode)
        {
            var customerId = getUserMetaData().Id;
            var order = await orderService.GetOrder(orderCode).ConfigureAwait(false);

            if (order == null)
                throw new WWSSException("Order not found", StatusCodes.Status404NotFound);

            if (order.CustomerId != customerId)
                throw new WWSSException("Resource is not available", StatusCodes.Status403Forbidden);

            try
            {
                var success = await orderService.ProcessOrder(orderCode).ConfigureAwait(false);
                if (success)
                    order.State = Domain.Orders.Order.OrderState.Processing;

                return Ok(OrderResponse.Of(order));

            }
            catch (OrderNotFoundException)
            {
                throw new WWSSException("Order not found", StatusCodes.Status404NotFound);
            }
            catch (OrderAlreadyProcessingException)
            {
                throw new WWSSException("Order is already being processed", StatusCodes.Status400BadRequest);
            }
        }

        [HttpGet("{orderCode}")]
        [Authorize(policy: "Customer")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrderResponse>> GetOrder(Guid orderCode)
        {
            var customerId = getUserMetaData().Id;
            var order = await orderService.GetOrder(orderCode).ConfigureAwait(false);

            if (order == null)
                throw new WWSSException("Order not found", StatusCodes.Status404NotFound);

            if (order.CustomerId != customerId)
                throw new WWSSException("Resource is not available", StatusCodes.Status403Forbidden);

            return Ok(OrderResponse.Of(order));
        }

        [HttpGet]
        [Authorize(policy: "Customer")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<ActionResult<List<OrderResponse>>> GetOrders()
        {
            var customerId = getUserMetaData().Id;
            var orders = await orderService.GetOrders(customerId).ConfigureAwait(false);

            return Ok(orders.Select(o => OrderResponse.Of(o)));
        }
    }
}
