using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.UserClient.DTOs
{
    public class AddressResponse
    {
        public AddressResponse()
        {
        }

        public AddressResponse(string zip, string city, string street, string countryCode)
        {
            Zip = zip;
            City = city;
            Street = street;
            CountryCode = countryCode;
        }

        [JsonProperty(PropertyName = "zip")]
        public string Zip { get; set; } = "";

        [JsonProperty(PropertyName = "city")]
        public string City { get; set; } = "";

        [JsonProperty(PropertyName = "street")]
        public string Street { get; set; } = "";

        [JsonProperty(PropertyName = "countryCode")]
        public string CountryCode { get; set; } = "";
    }
}
