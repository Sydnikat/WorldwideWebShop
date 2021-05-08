using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Invoices.DbEntities
{
    public class Invoice
    {
        public Invoice(string _id, Guid id, string customerId, double totalPrice, Guid orderCode, DateTime created, string zip, string city, string street, string countryCode, string email)
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
            Email = email;
        }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }

        [BsonElement("Id")]
        public Guid Id { get; set; }

        [BsonElement("CustomerId")]
        public string CustomerId { get; set; }

        [BsonElement("TotalPrice")]
        public double TotalPrice { get; set; }

        [BsonElement("OrderCode")]
        public Guid OrderCode { get; set; }

        [BsonElement("Created")]
        public DateTime Created { get; set; }

        [BsonElement("Zip")]
        public string Zip { get; set; }

        [BsonElement("City")]
        public string City { get; set; }

        [BsonElement("Street")]
        public string Street { get; set; }

        [BsonElement("CountryCode")]
        public string CountryCode { get; set; }

        [BsonElement("Email")]
        public string Email { get; set; }
    }
}
