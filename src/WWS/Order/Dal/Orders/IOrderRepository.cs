using Domain.OrderItems;
using Domain.Orders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Orders
{
    public interface IOrderRepository
    {
        Task<Order> FindById(long orderId);
        Task<Order> FindByOrderCode(Guid code);
        Task<IReadOnlyCollection<Order>> FindAllByCustomer(string cusomerId);
        Task<Order> Insert(Order order);
        Task<Order> InserOrderItem(long orderId, OrderItem item);
        Task<Order> InserOrderItem(Order order, OrderItem item);
        Task<bool> DeleteOrder(long orderId);
        Task<Order> Update(Order order);
    }
}
