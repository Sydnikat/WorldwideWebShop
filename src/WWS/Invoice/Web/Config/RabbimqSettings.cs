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
        public string InvoiceCreatedQueue { get; set; }
        public string InvoiceCreatedExchange { get; set; }
        public string InvoiceCreatedRoutingkey { get; set; }
    }

    public interface IRabbimqSettings
    {
        public string FullHost { get; set; }
        public string Host { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string InvoiceCreatedQueue { get; set; }
        public string InvoiceCreatedExchange { get; set; }
        public string InvoiceCreatedRoutingkey { get; set; }
        public string OrderStateChangedQueue { get; set; }
    }
}
