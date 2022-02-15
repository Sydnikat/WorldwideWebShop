using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.IntegrationEvents
{
    public class OrderStateChangedEvent : IOrderStataChangedEvent
    {
        public Guid OrderCode { get; set; }
        public bool Success { get; set; }
    }

    public interface IOrderStataChangedEvent
    {
        public Guid OrderCode { get; set; }
        public bool Success { get; set; }
    }
}
