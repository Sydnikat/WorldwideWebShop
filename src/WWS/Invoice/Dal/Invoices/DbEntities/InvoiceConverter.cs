using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Invoices.DbEntities
{
    public static class InvoiceConverter
    {
        public static Func<DbEntities.Invoice, Domain.Invoices.Invoice> ToDomain =>
            invoice => new Domain.Invoices.Invoice(
                _id: invoice._id,
                id: invoice.Id,
                customerId: invoice.CustomerId,
                totalPrice: invoice.TotalPrice,
                orderCode: invoice.OrderCode,
                created: invoice.Created,
                zip: invoice.Zip,
                city: invoice.City,
                street: invoice.Street,
                countryCode: invoice.CountryCode
                );

        public static Func<Domain.Invoices.Invoice, DbEntities.Invoice> ToDal =>
            invoice => new DbEntities.Invoice(
                _id: invoice._id,
                id: invoice.Id,
                customerId: invoice.CustomerId,
                totalPrice: invoice.TotalPrice,
                orderCode: invoice.OrderCode,
                created: invoice.Created,
                zip: invoice.Zip,
                city: invoice.City,
                street: invoice.Street,
                countryCode: invoice.CountryCode
                );

        public static Func<Domain.Invoices.Invoice, DbEntities.Invoice> ToDalNew =>
            invoice => new DbEntities.Invoice(
                _id: null,
                id: invoice.Id,
                customerId: invoice.CustomerId,
                totalPrice: invoice.TotalPrice,
                orderCode: invoice.OrderCode,
                created: invoice.Created,
                zip: invoice.Zip,
                city: invoice.City,
                street: invoice.Street,
                countryCode: invoice.CountryCode
                );
    }
}
