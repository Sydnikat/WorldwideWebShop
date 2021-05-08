using Domain.Invoices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Controllers.DTOs.Requests
{
    public class CreateInvoiceRequest
    {
        public enum OrderState
        {
            InProgress,
            Processing,
            Active,
            Failed,
            Billed
        }

        public CreateInvoiceRequest()
        {
        }

        public CreateInvoiceRequest(
            Guid orderCode,
            string customerId,
            string customerName,
            double totalPrice,
            ICollection<OrderItemRequest> items,
            DateTime created,
            OrderState state,
            string zip,
            string city,
            string street,
            string countryCode,
            string email,
            string phone)
        {
            OrderCode = orderCode;
            CustomerId = customerId;
            CustomerName = customerName;
            TotalPrice = totalPrice;
            Items = items;
            Created = created;
            State = state;
            Zip = zip;
            City = city;
            Street = street;
            CountryCode = countryCode;
            Email = email;
            Phone = phone;
        }

        public Guid OrderCode { get; set; }
        public string CustomerId { get; set; }
        public string CustomerName { get; set; }
        public double TotalPrice { get; set; }
        public ICollection<OrderItemRequest> Items { get; set; }
        public DateTime Created { get; set; }
        public OrderState State { get; set; }
        public string Zip { get; set; }
        public string City { get; set; }
        public string Street { get; set; }
        public string CountryCode { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public Invoice ToInvoice()
            => new Invoice(
                _id: null,
                id: Guid.Empty,
                customerId: CustomerId,
                totalPrice: TotalPrice,
                orderCode: OrderCode,
                created: DateTime.Now,
                zip: Zip,
                city: City,
                street: Street,
                countryCode: CountryCode,
                email: Email
                );
    }
}
