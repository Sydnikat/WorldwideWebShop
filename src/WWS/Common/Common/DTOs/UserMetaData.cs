using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common.DTOs
{
    public class UserMetaData
    {
        public string Id { get; set; }
        public List<string> Roles { get; set; }
        public string UserName { get; set; }
        public string FullName { get; set; }
    }
}
