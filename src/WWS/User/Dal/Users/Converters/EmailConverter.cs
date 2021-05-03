using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Users.Converters
{
    public static class EmailConverter
    {
        public static Domain.Users.Email ToDomain(this DbEntities.Email email) =>
            new Domain.Users.Email(
                value: email.Value,
                confirmed: email.Confirmed
                );

        public static DbEntities.Email ToDal(this Domain.Users.Email email) =>
            new DbEntities.Email(
                value: email.Value,
                confirmed: email.Confirmed
                );
    }
}
