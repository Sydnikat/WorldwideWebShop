using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.OrderItems.DbEntites
{
    public class OrderItem
    {
        public OrderItem()
        {
        }

        public OrderItem(long id, long orderId, long itemId, string name, float price, int count)
        {
            _id = id;
            OrderId = orderId;
            ItemId = itemId;
            Name = name;
            Price = price;
            Count = count;
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long _id { get; set; }
        public long OrderId { get; set; }
        public long ItemId { get; set; }
        public string Name { get; set; }
        public float Price { get; set; }
        public int Count { get; set; }
    }
}
