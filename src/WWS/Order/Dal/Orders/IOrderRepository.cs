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
        Task<Order> FindByOrderCode(Guid code);
        Task<Order> Insert(Order order);
        Task<Order> InserOrderItem(long orderId, OrderItem item);
    }
}
