using Domain.Invoices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Services
{
    public interface INotificationService
    {
        Task PublishInvoiceCreatedEvent(Invoice invoice);
    }
}
