using Domain.Invoices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Controllers.DTOs.Responses
{
    public class InvoiceResponse
    {
        public InvoiceResponse()
        {
        }

        public InvoiceResponse(Guid id, string customerId, double totalPrice, Guid orderCode, DateTime created, string zip, string city, string street, string countryCode)
        {
            Id = id;
            CustomerId = customerId;
            TotalPrice = totalPrice;
            OrderCode = orderCode;
            Created = created;
            Zip = zip;
            City = city;
            Street = street;
            CountryCode = countryCode;
        }

        public Guid Id { get; set; }
        public string CustomerId { get; set; }
        public double TotalPrice { get; set; }
        public Guid OrderCode { get; set; }
        public DateTime Created { get; set; }
        public string Zip { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string CountryCode { get; set; }

        public static InvoiceResponse Of(Invoice invocie)
            => new InvoiceResponse(
                id: invocie.Id,
                customerId: invocie.CustomerId,
                totalPrice: invocie.TotalPrice,
                orderCode: invocie.OrderCode,
                created: invocie.Created,
                zip: invocie.Zip,
                city: invocie.City,
                street: invocie.Street,
                countryCode: invocie.CountryCode
                );
    }
}
