using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Services.Exceptions
{
    public class OrderAlreadyFinishedException : Exception
    {
        public Guid OrderCode { get; set; }

        public OrderAlreadyFinishedException(Guid orderCode)
        {
            OrderCode = orderCode;
        }
    }
}
