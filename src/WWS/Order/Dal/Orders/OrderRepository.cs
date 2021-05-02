using Common;
using Dal.Orders.DbEntities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Orders
{
    public class OrderRepository : IOrderRepository
    {
        private readonly WWSContext context;

        private DbSet<Order> _orders => context.Orders;

        public OrderRepository(WWSContext context)
        {
            this.context = context;
        }

        public async Task<Domain.Orders.Order> FindById(long orderId)
        {
            return await _orders.AsNoTracking()
                .Include(o => o.Items)
                .Where(o => o._id == orderId)
                .SingleOrDefaultAsync()
                .ToDomainOrNull(OrderConverter.ToDomain);
        }

        public async Task<Domain.Orders.Order> FindByCustomer(string cusomerId)
        {
            return await _orders.AsNoTracking()
                .Include(o => o.Items)
                .Where(o => o.CustomerId == cusomerId)
                .SingleOrDefaultAsync()
                .ToDomainOrNull(OrderConverter.ToDomain);
        }

        public async Task<Domain.Orders.Order> FindByOrderCode(Guid code)
        {
            return await _orders.AsNoTracking()
                .Include(o => o.Items)
                .Where(o => o.OrderCode == code)
                .SingleOrDefaultAsync()
                .ToDomainOrNull(OrderConverter.ToDomain);
        }

        public async Task<Domain.Orders.Order> InserOrderItem(long orderId, Domain.OrderItems.OrderItem item)
        {
            if (item == null)
                throw new ArgumentNullException(nameof(item));

            var dbOrderItem = item.ToDalOrNull(OrderItems.DbEntites.OrderItemConverter.ToDalNew);

            var dbOrder = await _orders
                .Include(o => o.Items)
                .Where(o => o._id == orderId)
                .SingleOrDefaultAsync();

            if (dbOrder == null)
                return null;

            dbOrder.Items.Add(dbOrderItem);

            await context.SaveChangesAsync();

            return dbOrder.ToDomainOrNull(OrderConverter.ToDomain);
        }

        public async Task<Domain.Orders.Order> InserOrderItem(Domain.Orders.Order order, Domain.OrderItems.OrderItem item)
        {
            if (order == null)
                throw new ArgumentNullException(nameof(order));

            if (item == null)
                throw new ArgumentNullException(nameof(item));

            var dbOrderItem = item.ToDalOrNull(OrderItems.DbEntites.OrderItemConverter.ToDalNew);

            var dbOrder = order.ToDalOrNull(OrderConverter.ToDal);

            dbOrder.Items.Add(dbOrderItem);

            await context.SaveChangesAsync();

            return dbOrder.ToDomainOrNull(OrderConverter.ToDomain);
        }

        public async Task<Domain.Orders.Order> Insert(Domain.Orders.Order order)
        {
            if (order == null)
                throw new ArgumentNullException(nameof(order));

            var dbOrder = order.ToDalOrNull(OrderConverter.ToDalNew);

            await _orders.AddAsync(dbOrder);

            await context.SaveChangesAsync();

            return dbOrder.ToDomainOrNull(OrderConverter.ToDomain);
        }

        public async Task<bool> DeleteOrder(long orderId)
        {
            var dbOrder = await _orders
                .Include(o => o.Items)
                .Where(o => o._id == orderId)
                .SingleOrDefaultAsync();

            if (dbOrder == null)
                return false;

            _orders.Remove(dbOrder);

            await context.SaveChangesAsync();

            return true;
        }

        public async Task<Domain.Orders.Order> Update(Domain.Orders.Order order)
        {
            if (order == null)
                throw new ArgumentNullException(nameof(order));

            var dbOrder = await findByIdWithTracking(order.Id);

            if (dbOrder == null)
                return null;

            dbOrder.State = order.State.ToDal();
            dbOrder.TotalPrice = order.TotalPrice;

            await context.SaveChangesAsync();

            return dbOrder.ToDomainOrNull(OrderConverter.ToDomain);
        }

        private async Task<Order> findByIdWithTracking(long id)
           => await _orders
              .Where(o => o._id == id)
              .SingleOrDefaultAsync();
    }
}
