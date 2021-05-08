using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Middlewares.Authorizations.Policies
{
    public class CustomerRequirementPolicy : IAuthorizationRequirement
    {
        public CustomerRequirementPolicy()
        {
        }

        public bool HasCustomerInRoles(List<string> roles) => roles.Contains("Customer");
    }
}
