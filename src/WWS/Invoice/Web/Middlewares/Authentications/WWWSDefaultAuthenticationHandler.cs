using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Web.DTOs.Exception;
using static Web.Middlewares.ErrorHandlerMiddleware;

namespace Web.Middlewares.Authentications
{
    public class WWWSDefaultAuthenticationHandler : IAuthenticationHandler
    {
        private HttpContext _context;

        public Task InitializeAsync(AuthenticationScheme scheme, HttpContext context)
        {
            _context = context;
            return Task.CompletedTask;
        }

        public Task<AuthenticateResult> AuthenticateAsync()
            => Task.FromResult(AuthenticateResult.NoResult());

        public async Task ChallengeAsync(AuthenticationProperties properties)
        {
            var response = _context.Response;
            response.ContentType = "application/json";
            response.StatusCode = StatusCodes.Status403Forbidden;

            var result = JsonSerializer.Serialize(new GlobalExceptionResponse("User cannot access this resource", StatusCodes.Status403Forbidden), Common.DTOs.JsonSerializationOptions.options);
            await response.WriteAsync(result);
        }

        public Task ForbidAsync(AuthenticationProperties properties)
        {
            throw new WWSSException("User cannot access this resource", StatusCodes.Status403Forbidden);
        }
    }
}
