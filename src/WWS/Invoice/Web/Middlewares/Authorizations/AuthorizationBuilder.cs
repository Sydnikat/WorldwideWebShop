using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Middlewares.Authorizations.Handlers;
using Web.Middlewares.Authorizations.Policies;

namespace Web.Middlewares.Authorizations
{
    public static class AuthorizationBuilder
    {
        public static void AddWWSAuthorization(this IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy("Customer", policy => {
                    policy.Requirements.Add(new CustomerRequirementPolicy());
                });
            });

            services.AddSingleton<IAuthorizationHandler, CustomerRequirementPolicyHandler>();
        }
    }
}
