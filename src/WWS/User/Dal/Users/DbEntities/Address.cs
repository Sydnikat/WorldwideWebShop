using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Users.DbEntities
{
    public class Address
    {
        public Address(string zip, string city, string street, string countryCode)
        {
            Zip = zip;
            City = city;
            Street = street;
            CountryCode = countryCode;
        }

        [BsonElement("Zip")]
        public string Zip { get; set; }

        [BsonElement("City")]
        public string City { get; set; }

        [BsonElement("Street")]
        public string Street { get; set; }

        [BsonElement("CountryCode")]
        public string CountryCode { get; set; }
    }
}
