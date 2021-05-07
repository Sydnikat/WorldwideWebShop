using Common.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Services;

namespace Web.Controllers
{
    public abstract class WWSControllerBase : ControllerBase
    {
        protected readonly IJwtAuthManager jwtAuthManager;

        protected WWSControllerBase(IJwtAuthManager jwtAuthManager)
        {
            this.jwtAuthManager = jwtAuthManager;
        }

        protected UserMetaData getUserMetaData() => (UserMetaData)HttpContext?.Items["User"];

        protected UserMetaData getUserFromAccessToken()
        {
            var accessToken = HttpContext.Request.Headers["Authorization"].FirstOrDefault().Split(" ").Last();
            if (string.IsNullOrWhiteSpace(accessToken))
                return null;

            var (principal, jwtToken) = jwtAuthManager.DecodeJwtToken(accessToken);

            var user = new UserMetaData
            {
                Id = jwtToken.Claims.First(x => x.Type == "Id").Value,
                Roles = jwtToken.Claims.First(x => x.Type == "Roles").Value.Split(" ").ToList(),
                FullName = jwtToken.Claims.First(x => x.Type == "FullName").Value,
                UserName = jwtToken.Claims.First(x => x.Type == "sub").Value
            };

            return user;
        }
    }
}
