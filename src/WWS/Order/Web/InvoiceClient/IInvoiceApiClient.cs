using Refit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.InvoiceClient.DTOs;

namespace Web.InvoiceClient
{
    public interface IInvoiceApiClient
    {
        [Post("/internal/invoices")]
        Task CreateInvoice([Body] CreateInvoiceRequest request);
    }
}
