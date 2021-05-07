using Domain.Cart;
using Domain.OrderItems;
using Domain.Orders;
using System;
using System.Threading.Tasks;
using Web.UserClient.DTOs;

namespace Web.Services
{
    public interface IOrderService
    {
        Task<Order> GetOrder(string customerId);

        Task<Order> GetOrder(Guid orderCode);

        Task<Order> GetOrder(long orderId);

        Task<Order> CreateOrder(Cart cart, UserResponse userDetails);

        Task<Order> AddItem(long orderId, OrderItem patchData);

        Task<bool> DeleteOrder(long orderId);

        Task<bool> BillOrder(long orderId);
    }
}
