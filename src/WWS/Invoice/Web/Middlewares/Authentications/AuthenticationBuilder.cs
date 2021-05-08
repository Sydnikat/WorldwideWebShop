using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Middlewares.Authentications
{
    public static class AuthenticationBuilder
    {
        public static void AddWWSAuthentication(this IServiceCollection services)
        {
            services.AddAuthentication(options =>
            {
                options.DefaultChallengeScheme = "Decline by default";
                options.DefaultForbidScheme = "Decline by default";
                options.AddScheme<WWWSDefaultAuthenticationHandler>("Decline by default", "Decline by default");
            });
        }
    }
}
