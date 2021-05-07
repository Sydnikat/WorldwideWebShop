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

        public Order(
            long id,
            Guid orderCode,
            string customerId,
            string customerName,
            float totalPrice,
            ICollection<OrderItem> items,
            DateTime created, 
            OrderState state, 
            string zip, 
            string city, 
            string street, 
            string countryCode,
            string email, 
            string phone)
        {
            _id = id;
            OrderCode = orderCode;
            CustomerId = customerId;
            CustomerName = customerName;
            TotalPrice = totalPrice;
            Items = items;
            Created = created;
            State = state;
            Zip = zip;
            City = city;
            Street = street;
            CountryCode = countryCode;
            Email = email;
            Phone = phone;
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long _id { get; set; }
        public Guid OrderCode { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public float TotalPrice { get; set; }
        public ICollection<OrderItem> Items { get; set; }
        public DateTime Created { get; set; }
        public OrderState State { get; set; }
        public string Zip { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string CountryCode { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
    }
}
