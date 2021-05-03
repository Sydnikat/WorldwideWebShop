using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Web.Config
{
    public static class JwtBuilder
    {
        public static void AddJwtSetup(this IServiceCollection services, IConfiguration config)
        {
            configureJwtParams(services, config);
        }

        private static void configureJwtParams(IServiceCollection services, IConfiguration config)
        {
            services.Configure<JwtTokenConfig>(config.GetSection(nameof(JwtTokenConfig)));

            services.AddSingleton<IJwtTokenConfig>(sp => sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<JwtTokenConfig>>().Value);
        }
    }
}
