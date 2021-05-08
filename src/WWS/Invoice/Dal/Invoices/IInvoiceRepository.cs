using Domain.Invoices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Invoices
{
    public interface IInvoiceRepository
    {
        public Task<Invoice> FindById(Guid id);
        public Task<Invoice> FindByOrderCode(Guid orderCode);
        public Task<Invoice> Save(Invoice invoice);
    }
}
