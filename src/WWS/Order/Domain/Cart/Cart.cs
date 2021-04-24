using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Cart
{
    public class Cart
    {
        public Cart(string customerId)
        {
            CustomerId = customerId;
        }

        public string CustomerId { get; set; }
        public double TotalPrice 
        {
            get
            {
                return Items.ToList().Select(i => i.Price).Sum();
            }
        }
        public ICollection<CartItem> Items { get; set; } = new List<CartItem>();
    }
}
