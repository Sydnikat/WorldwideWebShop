using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Config
{
    public static class RabbitmqBuilder
    {
        public static void AddRabbitmqSettings(this IServiceCollection services, IConfiguration config)
        {
            services.Configure<RabbimqSettings>(config.GetSection(nameof(RabbimqSettings)));

            services.AddSingleton<IRabbimqSettings>(sp => sp.GetRequiredService<IOptions<RabbimqSettings>>().Value);
        }
    }
}
