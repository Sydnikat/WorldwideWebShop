using Dal.Invoices;
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
            services.Configure<InvoiceDatabaseSettings>(config.GetSection(nameof(InvoiceDatabaseSettings)));

            services.AddSingleton<IInvoiceDatabaseSettings>(sp =>
                sp.GetRequiredService<IOptions<InvoiceDatabaseSettings>>().Value);
        }
    }
}
