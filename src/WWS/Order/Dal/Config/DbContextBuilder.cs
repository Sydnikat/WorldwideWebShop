using Dal.Orders;
using Microsoft.EntityFrameworkCore;
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
    public static class DbContextBuilder
    {
        public static void AddSqlServer(this IServiceCollection services, IConfiguration config)
        {
            configureSqlServer(services, config);

            var sp = services.BuildServiceProvider();
            var settings = sp.GetService<IDatabaseSettings>();

            services.AddDbContext<WWSContext>(o =>
            {
                o.UseSqlServer(settings.MSSQLConnection);
            });


            services.AddTransient<IOrderRepository, OrderRepository>();
        }

        private static void configureSqlServer(IServiceCollection services, IConfiguration config)
        {
            services.Configure<DatabaseSettings>(config.GetSection(nameof(DatabaseSettings)));

            services.AddSingleton<IDatabaseSettings>(sp => sp.GetRequiredService<IOptions<DatabaseSettings>>().Value);
        }
    }
}
