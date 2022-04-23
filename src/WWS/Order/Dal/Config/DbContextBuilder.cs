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
            var mssqlUsername = Environment.GetEnvironmentVariable(EnvironmentVariables.MSSQLUsername);
            var mssqlPassword = Environment.GetEnvironmentVariable(EnvironmentVariables.MSSQLPassword);
            var mssqlDatabase = Environment.GetEnvironmentVariable(EnvironmentVariables.MSSQLDatabase);
            var mssqlHost = Environment.GetEnvironmentVariable(EnvironmentVariables.MSSQLHost);

            var mssqlConnectionStr = $"Server={mssqlHost};User Id={mssqlUsername};Password={mssqlPassword};Database={mssqlDatabase};";

            services.AddSingleton<IDatabaseSettings>(new DatabaseSettings()
            {
                MSSQLConnection = mssqlConnectionStr,
            });
        }
    }
}
