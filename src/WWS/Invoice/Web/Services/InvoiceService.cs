using Dal.Invoices;
using Domain.Invoices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IInvoiceRepository invoiceRepository;

        public InvoiceService(IInvoiceRepository invoiceRepository)
        {
            this.invoiceRepository = invoiceRepository;
        }

        public async Task<Invoice> CreateInvoice(Invoice patchData)
        {
            patchData.Created = DateTime.Now;
            patchData.Id = Guid.NewGuid();

            return await invoiceRepository.Save(patchData).ConfigureAwait(false);
        }

        public async Task<Invoice> GetInvoice(Guid orderId)
        {
            return await invoiceRepository.FindByOrderCode(orderId).ConfigureAwait(false);
        }

        public async Task<Invoice> GetInvoiceWithId(Guid id)
        {
            return await invoiceRepository.FindById(id).ConfigureAwait(false);
        }
    }
}
