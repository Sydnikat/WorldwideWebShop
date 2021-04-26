using Domain.OrderItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Cart
{
    public class CartItem
    {
        public CartItem(long itemId, string name, float price, int count)
        {

            ItemId = itemId;
            Name = name;
            Price = price;
            Count = count;
        }
        public long ItemId { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public int Count { get; set; }

        public OrderItem ToNewOrderItem(long orderId)
            => new OrderItem(0, orderId, ItemId, Name, Price, Count);
    }
}
