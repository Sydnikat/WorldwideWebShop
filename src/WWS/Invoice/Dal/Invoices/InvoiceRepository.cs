using Common;
using Dal.Config;
using Dal.Invoices.DbEntities;
using Domain.Invoices;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Invoices
{
    public class InvoiceRepository : IInvoiceRepository
    {
        private readonly IMongoCollection<DbEntities.Invoice> _invoices;
        public InvoiceRepository(IInvoiceDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _invoices = database.GetCollection<DbEntities.Invoice>(settings.InvoicesCollectionName);
        }

        public async Task<Domain.Invoices.Invoice> FindById(Guid id)
        {
            var filter = Builders<DbEntities.Invoice>.Filter.Where(u => u.Id == id);
            var query = await _invoices.FindAsync(filter);
            return query.FirstOrDefault().ToDomainOrNull(InvoiceConverter.ToDomain);
        }

        public async Task<Domain.Invoices.Invoice> FindByOrderCode(Guid orderCode)
        {
            var filter = Builders<DbEntities.Invoice>.Filter.Where(u => u.OrderCode == orderCode);
            var query = await _invoices.FindAsync(filter);
            return query.FirstOrDefault().ToDomainOrNull(InvoiceConverter.ToDomain);
        }

        public async Task<Domain.Invoices.Invoice> Save(Domain.Invoices.Invoice invoice)
        {
            if (invoice == null)
                return null;

            var dbUser = invoice.ToDalOrNull(InvoiceConverter.ToDalNew);

            await _invoices.InsertOneAsync(dbUser).ConfigureAwait(false);

            return invoice;
        }
    }
}
