using Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Services
{
    public interface INotificationService
    {
        Task PublishUserRegisteredEvent(User user);
    }
}
