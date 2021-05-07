using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.IntegrationEvents
{
    public class UserRegisteredEvent : IUserRegisteredEvent
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
    }

    public interface IUserRegisteredEvent
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
    }
}
