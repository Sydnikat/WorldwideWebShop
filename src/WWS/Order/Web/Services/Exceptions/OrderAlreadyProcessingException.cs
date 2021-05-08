using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Services.Exceptions
{
    public class OrderAlreadyProcessingException : Exception
    {
        public Guid OrderCode { get; set; }

        public OrderAlreadyProcessingException(Guid orderCode)
        {
            OrderCode = orderCode;
        }
    }
}
