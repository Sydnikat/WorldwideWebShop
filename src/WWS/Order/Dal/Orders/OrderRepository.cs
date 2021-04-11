using Domain.OrderItems;
using Domain.Orders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Orders
{
    public class OrderRepository : IOrderRepository
    {
        public Task<Order> FindByOrderCode(Guid code)
        {
            throw new NotImplementedException();
        }

        public Task<Order> InserOrderItem(long orderId, OrderItem item)
        {
            throw new NotImplementedException();
        }

        public Task<Order> Insert(Order order)
        {
            throw new NotImplementedException();
        }
    }
}
