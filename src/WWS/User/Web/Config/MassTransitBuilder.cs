using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.IntegrationEvents;

namespace Web.Config
{
    public static class MassTransitBuilder
    {
        public static void AddMassTransitSetup(this IServiceCollection services, IConfiguration config)
        {
            configureSqlServer(services, config);

            var sp = services.BuildServiceProvider();
            var settings = sp.GetService<IRabbimqSettings>();

            services.AddMassTransit();
        }

        private static void configureSqlServer(IServiceCollection services, IConfiguration config)
        {
            services.Configure<RabbimqSettings>(config.GetSection(nameof(RabbimqSettings)));

            services.AddSingleton<IRabbimqSettings>(sp => sp.GetRequiredService<IOptions<RabbimqSettings>>().Value);
        }
    }
}
