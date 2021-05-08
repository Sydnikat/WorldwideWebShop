using Domain.Invoices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Services
{
    public interface IInvoiceService
    {
        Task<Invoice> CreateInvoice(Invoice patchData);
        Task<Invoice> GetInvoice(Guid orderId);
        Task<Invoice> GetInvoiceWithId(Guid id);
    }
}
