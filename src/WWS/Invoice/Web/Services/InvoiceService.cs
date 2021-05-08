using Dal.Invoices;
using Domain.Invoices;
using MassTransit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.IntegrationEvents;

namespace Web.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly IInvoiceRepository invoiceRepository;
        private readonly IPublishEndpoint publishEndpoint;

        public InvoiceService(IInvoiceRepository invoiceRepository, IPublishEndpoint publishEndpoint)
        {
            this.invoiceRepository = invoiceRepository;
            this.publishEndpoint = publishEndpoint;
        }

        public async Task<Invoice> CreateInvoice(Invoice patchData)
        {
            patchData.Created = DateTime.Now;
            patchData.Id = Guid.NewGuid();

            var savedInvoice = await invoiceRepository.Save(patchData).ConfigureAwait(false);

            if (savedInvoice != null)
            {
                await publishEndpoint.Publish(new OrderStataChangedEvent
                {
                    OrderCode = savedInvoice.OrderCode,
                    Success = true
                    
                }).ConfigureAwait(false);
            }

            return savedInvoice;
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
