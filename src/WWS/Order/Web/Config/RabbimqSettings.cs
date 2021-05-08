using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Config
{
    public class RabbimqSettings : IRabbimqSettings
    {
        public string FullHost { get; set; }
        public string Host { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string OrderStateChangedQueue { get; set; }
        public string OrderStateChangedQueueName { get; set; }
        public string orderCreatedQueue { get; set; }
        public string orderCreatedExchange { get; set; }
        public string orderCreatedRoutingkey { get; set; }
    }

    public interface IRabbimqSettings
    {
        public string FullHost { get; set; }
        public string Host { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string OrderStateChangedQueue { get; set; }
        public string OrderStateChangedQueueName { get; set; }
        public string orderCreatedQueue { get; set; }
        public string orderCreatedExchange { get; set; }
        public string orderCreatedRoutingkey { get; set; }
    }
}
