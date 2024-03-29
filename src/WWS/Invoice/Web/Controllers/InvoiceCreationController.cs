﻿using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Controllers.DTOs.Requests;
using Web.Services;

namespace Web.Controllers
{
    [Route("/internal/invoices")]
    [ApiController]
    public class InvoiceCreationController : ControllerBase
    {
        private readonly IInvoiceService invoiceService;
        private readonly INotificationService notificationService;

        public InvoiceCreationController(IInvoiceService invoiceService, INotificationService notificationService)
        {
            this.invoiceService = invoiceService;
            this.notificationService = notificationService;
        }

        [HttpPost]
        public async Task<ActionResult> CreateInvoice([FromBody] CreateInvoiceRequest request)
        {
            if (request == null)
                return BadRequest();

            var savedInvoice = await invoiceService.CreateInvoice(request.ToInvoice()).ConfigureAwait(false);

            if (savedInvoice != null)
            {
                await notificationService.PublishInvoiceCreatedEvent(savedInvoice).ConfigureAwait(false);
                return Ok();
            }

            return Conflict();
        }
    }
}
