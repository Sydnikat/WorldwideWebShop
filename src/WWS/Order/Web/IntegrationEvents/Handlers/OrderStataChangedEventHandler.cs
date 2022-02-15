using MassTransit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Services;

namespace Web.IntegrationEvents.Handlers
{
    public class OrderStataChangedEventHandler : IConsumer<IOrderStateChangedEvent>
    {
        private readonly IOrderService orderService;

        public OrderStataChangedEventHandler(IOrderService orderService)
        {
            this.orderService = orderService;
        }

        public async Task Consume(ConsumeContext<IOrderStateChangedEvent> context)
        {
            var orderCode = context.Message.OrderCode;
            var success = context.Message.Success;

            await orderService.BillOrder(orderCode, success).ConfigureAwait(false);
        }
    }
}
