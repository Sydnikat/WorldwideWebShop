using Dal.Orders;
using Mapping;
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
            var mssqlConnection = Environment.GetEnvironmentVariable(EnvironmentVariables.MSSQLConnection);

            services.AddSingleton<IDatabaseSettings>(new DatabaseSettings()
            {
                MSSQLConnection = mssqlConnection,
            });
        }
    }
}
