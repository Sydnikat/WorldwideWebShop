using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.IntegrationEvents
{
    public class OrderStataChangedEvent : IOrderStateChangedEvent
    {
        public Guid OrderCode { get; set; }
        public bool Success { get; set; }
    }

    public interface IOrderStateChangedEvent
    {
        public Guid OrderCode { get; set; }
        public bool Success { get; set; }
    }
}
