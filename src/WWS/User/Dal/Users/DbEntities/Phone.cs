using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Users.DbEntities
{
    public class Phone
    {
        public Phone(string value, bool confirmed)
        {
            Value = value;
            Confirmed = confirmed;
        }

        [BsonElement("Value")]
        public string Value { get; set; }


        [BsonElement("Confirmed")]
        public bool Confirmed { get; set; }
    }
}
