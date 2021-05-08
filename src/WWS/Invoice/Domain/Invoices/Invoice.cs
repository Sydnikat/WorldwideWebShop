using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Invoices
{
    public class Invoice
    {
        public Invoice(string _id, Guid id, string customerId, double totalPrice, Guid orderCode, DateTime created, string zip, string city, string street, string countryCode)
        {
            this._id = _id;
            Id = id;
            CustomerId = customerId;
            TotalPrice = totalPrice;
            OrderCode = orderCode;
            Created = created;
            Zip = zip;
            City = city;
            Street = street;
            CountryCode = countryCode;
        }

        public string _id { get; set; }
        public Guid Id { get; set; }
        public string CustomerId { get; set; }
        public double TotalPrice { get; set; }
        public Guid OrderCode { get; set; }
        public DateTime Created { get; set; }
        public string Zip { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string CountryCode { get; set; }
    }
}
