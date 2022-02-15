using Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.IntegrationEvents;

namespace Web.Services
{
    public interface INotificationService
    {
        Task PublishUserRegisteredEvent(User user);
        Task NotifyUsersForCategoryPromotion(List<Email> userEmails, CategoryDiscountCreatedEvent e);
    }
}
