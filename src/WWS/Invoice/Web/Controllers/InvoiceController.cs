using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Controllers.Config;
using Web.Controllers.DTOs.Responses;
using Web.Services;
using static Web.Middlewares.ErrorHandlerMiddleware;

namespace Web.Controllers
{
    [Route("api/invoice/invoices")]
    [ApiController]
    public class InvoiceController : WWSControllerBase
    {
        private readonly IInvoiceService invoiceService;

        public InvoiceController(IInvoiceService invoiceService)
        {
            this.invoiceService = invoiceService;
        }

        [HttpGet("{orderCode}")]
        [Authorize(policy: "Customer")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<InvoiceResponse>> GetInvoice(Guid orderCode)
        {
            var customerId = getUserMetaData().Id;
            var invoice = await invoiceService.GetInvoice(orderCode);

            if (invoice == null)
                throw new WWSSException("Order not found", StatusCodes.Status404NotFound);

            if (invoice.CustomerId != customerId)
                throw new WWSSException("Resource is not available", StatusCodes.Status403Forbidden);

            return Ok(InvoiceResponse.Of(invoice));
        }
    }
}
