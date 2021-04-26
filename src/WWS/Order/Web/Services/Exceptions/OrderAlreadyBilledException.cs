using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Services.Exceptions
{
    public class OrderAlreadyBilledException : Exception
    {
        public long OrderId { get; set; }
        public OrderAlreadyBilledException(long orderId)
        {
            OrderId = orderId;
        }
    }
}
