using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Users.Converters
{
    public static class PhoneConverter
    { 
        public static Domain.Users.Phone ToDomain(this DbEntities.Phone phone) =>
            new Domain.Users.Phone(
                value: phone.Value,
                confirmed: phone.Confirmed
                );

        public static DbEntities.Phone ToDal(this Domain.Users.Phone phone) =>
            new DbEntities.Phone(
                value: phone.Value,
                confirmed: phone.Confirmed
                );
    }
}
