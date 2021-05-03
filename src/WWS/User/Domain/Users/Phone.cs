using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Users
{
    public class Phone
    {
        public Phone(string value, bool confirmed)
        {
            Value = value;
            Confirmed = confirmed;
        }

        public string Value { get; set; }
        public bool Confirmed { get; set; }
    }
}
