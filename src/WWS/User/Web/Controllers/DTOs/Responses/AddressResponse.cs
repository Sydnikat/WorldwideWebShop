using Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Controllers.DTOs.Responses
{
    public class AddressResponse
    {
        public AddressResponse(string zip, string city, string street, string countryCode)
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

        public static AddressResponse Of(Address address)
            => new AddressResponse(
                zip: address.Zip,
                city: address.City,
                countryCode: address.CountryCode,
                street: address.Street
                );
    }
}
