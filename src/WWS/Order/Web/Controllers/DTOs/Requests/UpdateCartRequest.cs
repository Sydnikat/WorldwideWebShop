using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Controllers.DTOs.Requests
{
    public class UpdateCartRequest
    {
        public long ItemId { get; set; }
        public int Count { get; set; }
    }
}
