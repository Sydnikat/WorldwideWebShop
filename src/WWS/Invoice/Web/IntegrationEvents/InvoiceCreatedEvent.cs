using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.IntegrationEvents
{
    public class InvoiceCreatedEvent : IInvoiceCreatedEvent
    {
        public double TotalPrice { get; set; }
        public string OrderCode { get; set; }
        public string Created { get; set; }
        public string Zip { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string CountryCode { get; set; }
        public string Email { get; set; }
    }

    public interface IInvoiceCreatedEvent
    {
        public double TotalPrice { get; set; }
        public string OrderCode { get; set; }
        public string Created { get; set; }
        public string Zip { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string CountryCode { get; set; }
        public string Email { get; set; }
    }
}
