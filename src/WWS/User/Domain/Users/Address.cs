using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Users
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

        public string Zip { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string CountryCode { get; set; }
    }
}
