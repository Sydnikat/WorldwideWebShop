using Dal.OrderItems.DbEntites;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Orders.DbEntities
{
    public class Order
    {
        public enum OrderState
        {
            InProgress,
            Billed
        }

        public Order()
        {
        }

        public Order(long id, Guid orderCode, string customerId, string customerName, double totalPrice, ICollection<OrderItem> items, DateTime created, OrderState state)
        {
            _id = id;
            OrderCode = orderCode;
            CustomerId = customerId;
            CustomerName = customerName;
            TotalPrice = totalPrice;
            Items = items;
            Created = created;
            State = state;
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long _id { get; set; }
        public Guid OrderCode { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public double TotalPrice { get; set; }
        public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
        public DateTime Created { get; set; }
        public OrderState State { get; set; }
    }
}
