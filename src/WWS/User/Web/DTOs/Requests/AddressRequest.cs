using Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.DTOs.Requests
{
    public class AddressRequest
    {
        public AddressRequest(string zip, string city, string street, string countryCode)
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

        public Address ToAddress() 
            => new Address(
                zip: Zip,
                city: City,
                street: Street,
                countryCode: CountryCode
                );
    }
}
