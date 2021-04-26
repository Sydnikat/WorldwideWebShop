using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.OrderItems.DbEntites
{
    public static class OrderItemConverter
    {
        public static Func<OrderItem, Domain.OrderItems.OrderItem> ToDomain => item
            => new Domain.OrderItems.OrderItem(
                id: item._id,
                orderId: item.OrderId,
                itemId: item.ItemId,
                name: item.Name,
                price: item.Price,
                count: item.Count
                );

        public static Func<Domain.OrderItems.OrderItem, OrderItem> ToDalNew => item
            => new OrderItem(
                id: 0,
                orderId: item.OrderId,
                itemId: item.ItemId,
                name: item.Name,
                price: item.Price,
                count: item.Count
                );

        public static Func<Domain.OrderItems.OrderItem, OrderItem> ToDal => item
            => new OrderItem(
                id: item.Id,
                orderId: item.OrderId,
                itemId: item.ItemId,
                name: item.Name,
                price: item.Price,
                count: item.Count
                );
    }
}
