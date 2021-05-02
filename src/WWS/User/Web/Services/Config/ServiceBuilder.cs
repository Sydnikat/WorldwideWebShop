using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Services.Config
{
    public static class ServiceBuilder
    {
        public static void AddServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddSingleton<IJwtAuthManager, JwtAuthManager>();
            services.AddTransient<IUserService, UserService>();
        }
    }
}
