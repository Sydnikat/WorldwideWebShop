using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Config
{
    public class RabbimqSettings : IRabbimqSettings
    {
        public string Host { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string MailQueue { get; set; }
        public string Exchange { get; set; }
        public string RoutingKey { get; set; }
    }

    public interface IRabbimqSettings
    {
        public string Host { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string MailQueue { get; set; }
        public string Exchange { get; set; }
        public string RoutingKey { get; set; }
    }
}
