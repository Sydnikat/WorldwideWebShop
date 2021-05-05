using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Middlewares.Authorizations.Policies;
using static Web.Middlewares.ErrorHandlerMiddleware;

namespace Web.Middlewares.Authorizations.Handlers
{
    public class CustomerRequirementPolicyHandler : AuthorizationHandler<CustomerRequirementPolicy>, IAuthorizationRequirement
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, CustomerRequirementPolicy requirement)
        {
            if (context.User == null && context.User.Claims == null)
            {
                context.Fail();
                return Task.CompletedTask;
            }

            if (!context.User.HasClaim(c => c.Type == "Roles"))
            {
                context.Fail();
                return Task.CompletedTask;
            }

            var roles = context.User.Claims.First(x => x.Type == "Roles").Value.Split(" ").ToList();
            if (requirement.HasCustomerInRoles(roles))
            {
                context.Succeed(requirement);
                return Task.CompletedTask;
            }
            else
            {
                context.Fail();
                return Task.CompletedTask;
                //throw new WWSSException("User cannot access this resource", StatusCodes.Status403Forbidden);
            }
        }
    }
}
