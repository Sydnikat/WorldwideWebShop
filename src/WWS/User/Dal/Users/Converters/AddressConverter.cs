using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Users.Converters
{
    public static class AddressConverter
    {
        public static Domain.Users.Address ToDomain(this DbEntities.Address address) =>
           new Domain.Users.Address(
               zip: address.Zip,
               city: address.City,
               street: address.Street,
               countryCode: address.CountryCode
               );

        public static DbEntities.Address ToDal(this Domain.Users.Address address) =>
           new DbEntities.Address(
               zip: address.Zip,
               city: address.City,
               street: address.Street,
               countryCode: address.CountryCode
               );
    }
}
