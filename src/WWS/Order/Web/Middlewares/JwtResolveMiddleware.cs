using Common.DTOs;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Web.Middlewares
{
    public class JwtResolveMiddleware
    {
        private readonly RequestDelegate _next;
        public JwtResolveMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            var accessToken = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ")?.Last();
            if (accessToken == null)
                await _next(context);
            else
            {
                var token = new JwtSecurityTokenHandler()
                    .ReadJwtToken(accessToken);

                context.Items["User"] = new UserMetaData
                {
                    Id = token.Claims.First(x => x.Type == "Id").Value,
                    Roles = token.Claims.First(x => x.Type == "Roles").Value.Split(" ").ToList(),
                    FullName = token.Claims.First(x => x.Type == "FullName").Value,
                    UserName = token.Claims.First(x => x.Type == "sub").Value

                };

                var principal = new ClaimsPrincipal();
                principal.AddIdentity(new ClaimsIdentity(token.Claims));
                context.User = principal;

                await _next(context);
            }
        }
    }
}
