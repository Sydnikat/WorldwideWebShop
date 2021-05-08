using Dal.Orders;
using Domain.Cart;
using Domain.OrderItems;
using Domain.Orders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Cache;
using Web.InvoiceClient;
using Web.InvoiceClient.DTOs;
using Web.Services.Exceptions;
using Web.UserClient.DTOs;
using static Domain.Orders.Order;

namespace Web.Services
{
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository orderRepository;
        private readonly IInvoiceApiClient invoiceApiClient;
        private readonly INotificationService notificationService;
        private readonly CartsCache cache;

        public OrderService(IOrderRepository orderRepository, IInvoiceApiClient invoiceApiClient, INotificationService notificationService, CartsCache cache)
        {
            this.orderRepository = orderRepository;
            this.invoiceApiClient = invoiceApiClient;
            this.notificationService = notificationService;
            this.cache = cache;
        }

        public async Task<Order> AddItem(long orderId, OrderItem patchData)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> DeleteOrder(long orderId)
        {
            return await orderRepository.DeleteOrder(orderId).ConfigureAwait(false);
        }

        public async Task<List<Order>> GetOrders(string customerId)
        {
            var list = await orderRepository.FindAllByCustomer(customerId).ConfigureAwait(false);
            return list.ToList();
        }

        public async Task<Order> GetOrder(Guid orderCode)
        {
            return await orderRepository.FindByOrderCode(orderCode).ConfigureAwait(false);
        }

        public async Task<Order> GetOrder(long orderId)
        {
            return await orderRepository.FindById(orderId).ConfigureAwait(false);
        }

        public async Task<bool> PayOrder(long orderId)
        {
            var order = await orderRepository.FindById(orderId).ConfigureAwait(false);
            if (order == null)
                throw new OrderNotFoundException(orderId);

            if (order.State == OrderState.Billed)
                throw new OrderAlreadyBilledException(orderId);

            order.State = OrderState.Billed;

            var updatedOrder = await orderRepository.Update(order);

            return updatedOrder != null;
        }

        public async Task<Order> CreateOrder(Cart cart, UserResponse userDetails)
        {
            var items = cart.Items.Select(ci => ci.ToNewOrderItem(0)).ToList();
            var newOrder = new Order(
                id: 0,
                orderCode: Guid.NewGuid(),
                customerId: cart.CustomerId,
                customerName: userDetails.UserFullName,
                totalPrice: cart.TotalPrice,
                items: items,
                created: DateTime.Now,
                state: OrderState.InProgress,
                zip: userDetails.Address.Zip,
                street: userDetails.Address.Street,
                city: userDetails.Address.City,
                countryCode: userDetails.Address.CountryCode,
                email: userDetails.Email,
                phone: userDetails.Phone
                );

            return await orderRepository.Insert(newOrder).ConfigureAwait(false);
        }

        public async Task<bool> ProcessOrder(Guid orderCode)
        {
            var order = await orderRepository.FindByOrderCode(orderCode).ConfigureAwait(false);
            if (order == null)
                throw new OrderNotFoundException(orderCode);

            if (order.State == OrderState.Processing)
                throw new OrderAlreadyProcessingException(orderCode);

            order.State = OrderState.Processing;

            var updatedOrder = await orderRepository.Update(order);

            if (updatedOrder != null)
            {
                var request = CreateInvoiceRequest.Of(updatedOrder);
                await invoiceApiClient.CreateInvoice(request).ConfigureAwait(false);
                await cache.Invalidate(updatedOrder.CustomerId).ConfigureAwait(false);
            }

            return updatedOrder != null;
        }

        public async Task<bool> BillOrder(Guid orderCode, bool success)
        {
            var order = await orderRepository.FindByOrderCode(orderCode).ConfigureAwait(false);
            if (order == null)
                throw new OrderNotFoundException(orderCode);

            if (order.State == OrderState.Active || order.State == OrderState.Failed)
                throw new OrderAlreadyFinishedException(orderCode);

            if (success)
            {
                order.State = OrderState.Active;
                await notificationService.PublishOrderCreatedEvent(order).ConfigureAwait(false);
            }
            else
                order.State = OrderState.Failed;

            var updatedOrder = await orderRepository.Update(order);

            return updatedOrder != null;
        }
    }
}
