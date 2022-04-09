using Mapping;
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
            var secret = Environment.GetEnvironmentVariable(EnvironmentVariables.JwtTokenSecret);
            var accessTokenExp = Environment.GetEnvironmentVariable(EnvironmentVariables.JwtTokenAccessTokenExpiration);
            var refreshTokenExp = Environment.GetEnvironmentVariable(EnvironmentVariables.JwtTokenRefreshTokenExpiration);

            services.AddSingleton<IJwtTokenConfig>(new JwtTokenConfig()
            {
                Secret = secret,
                AccessTokenExpiration = Int32.Parse(accessTokenExp),
                RefreshTokenExpiration = Int32.Parse(refreshTokenExp),
            });
        }
    }
}
