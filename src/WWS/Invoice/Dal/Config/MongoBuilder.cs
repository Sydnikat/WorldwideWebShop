using Dal.Invoices;
using Mapping;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Config
{
    public static class MongoBuilder
    {
        public static void AddMongodb(this IServiceCollection services, IConfiguration config)
        {
            configureMongodb(services, config);

            services.AddTransient<IInvoiceRepository, InvoiceRepository>();
        }

        private static void configureMongodb(IServiceCollection services, IConfiguration config)
        {
            var databaseName = Environment.GetEnvironmentVariable(EnvironmentVariables.MongodbDatabaseName);
            var connectionString = Environment.GetEnvironmentVariable(EnvironmentVariables.MongodbConnectionString);
            var collectionName = Environment.GetEnvironmentVariable(EnvironmentVariables.MongodbInvoiceCollectionName);

            services.AddSingleton<IInvoiceDatabaseSettings>(new InvoiceDatabaseSettings()
            {
                DatabaseName = databaseName,
                ConnectionString = connectionString,
                InvoicesCollectionName = collectionName,
            });
        }
    }
}
