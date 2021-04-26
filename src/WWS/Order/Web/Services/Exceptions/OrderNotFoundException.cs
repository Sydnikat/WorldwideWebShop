using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Services.Exceptions
{
    public class OrderNotFoundException : Exception
    {
        public long OrderId { get; set; }

        public OrderNotFoundException(long orderId)
        {
            OrderId = orderId;
        }
    }
}
