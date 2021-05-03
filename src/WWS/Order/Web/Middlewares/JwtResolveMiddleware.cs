using Common.DTOs;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
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
            var accessToken = context.Request.Headers["Authorization"].FirstOrDefault().Split(" ").Last();

            var handler = new JwtSecurityTokenHandler();

            var token = handler.ReadJwtToken(accessToken);

            var user = new UserMetaData
            {
                Id = token.Claims.First(x => x.Type == "Id").Value,
                Role = token.Claims.First(x => x.Type == "Role").Value,
                FullName = token.Claims.First(x => x.Type == "FullName").Value,
                UserName = token.Claims.First(x => x.Type == "sub").Value

            };

            context.Items["User"] = user;

            await _next(context);
        }
    }
}
