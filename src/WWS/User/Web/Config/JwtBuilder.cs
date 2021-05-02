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

            var sp = services.BuildServiceProvider();
            var settings = sp.GetService<IJwtTokenConfig>();

            services.AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(x =>
            {
                x.RequireHttpsMetadata = false;
                x.SaveToken = true;
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(settings.Secret)),
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero
                };
            });
        }

        private static void configureJwtParams(IServiceCollection services, IConfiguration config)
        {
            services.Configure<JwtTokenConfig>(config.GetSection(nameof(JwtTokenConfig)));

            services.AddSingleton<IJwtTokenConfig>(sp => sp.GetRequiredService<Microsoft.Extensions.Options.IOptions<JwtTokenConfig>>().Value);
        }
    }
}
