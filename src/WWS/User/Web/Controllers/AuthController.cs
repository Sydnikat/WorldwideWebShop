using Domain.Users;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Web.DTOs.Requests;
using Web.DTOs.Responses;
using Web.Services;
using static Web.Middlewares.ErrorHandlerMiddleware;

namespace Web.Controllers
{
    [Route("auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService userService;
        private readonly IJwtAuthManager jwtAuthManager;

        public AuthController(IUserService userService, IJwtAuthManager jwtAuthManager)
        {
            this.userService = userService;
            this.jwtAuthManager = jwtAuthManager;
        }

        [AllowAnonymous]
        [HttpPost("signin")]
        public async Task<ActionResult> Login([FromBody] LoginRequest request)
        {
            var user = await userService.GetUser(request.UserName).ConfigureAwait(false);

            if (user == null)
                return Unauthorized();

            if (!userService.IsValidUserCredentials(user, request.Password))
                return Unauthorized();
            

            var jwtResult = jwtAuthManager.GenerateTokens(user);
            return Ok(new LoginResult
            {
                UserName = user.UserName,
                Role = user.Role,
                AccessToken = jwtResult.AccessToken,
                RefreshToken = jwtResult.RefreshToken.TokenString
            });
        }

        [Route("signup")]
        [HttpPost]
        public async Task<ActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!request.Password.Equals(request.ConfirmPassword))
                return BadRequest();

            var patchData = request.ToNewUser();

            var savedUser = await userService.CreateUser(patchData).ConfigureAwait(false);

            if (savedUser != null)
                return Ok();

            return BadRequest();
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
                return Unauthorized();

            try
            {
                var accessToken = await HttpContext.GetTokenAsync("Bearer", "access_token");
                var user = await getUserFromAccessToken().ConfigureAwait(false);
                if (user == null)
                    return BadRequest();

                var jwtResult = jwtAuthManager.Refresh(request.RefreshToken, accessToken, DateTime.Now);

                return Ok(new LoginResult
                {
                    UserName = user.UserName,
                    Role = user.Role,
                    AccessToken = jwtResult.AccessToken,
                    RefreshToken = jwtResult.RefreshToken.TokenString
                });
            }
            catch (SecurityTokenException e)
            {
                throw new WWSSException(e.Message, StatusCodes.Status401Unauthorized);
            }
        }

        [HttpPost("check/customer")]
        public async Task<ActionResult> CheckCustomer()
        {
            try
            {
                var user = await getUserFromAccessToken().ConfigureAwait(false);
                if (user == null)
                    return BadRequest();

                if (user.Role == Domain.Users.User.UserRole.Customer)
                    return Ok();

                return Unauthorized();
            }
            catch (SecurityTokenException e)
            {
                throw new WWSSException(e.Message, StatusCodes.Status401Unauthorized);
            }
        }

        [HttpPost("check/admin")]
        public async Task<ActionResult> CheckAdmin()
        {
            try
            {
                var user = await getUserFromAccessToken().ConfigureAwait(false);
                if (user == null)
                    return BadRequest();

                if (user.Role == Domain.Users.User.UserRole.Admin)
                    return Ok();

                return Unauthorized();
            }
            catch (SecurityTokenException e)
            {
                throw new WWSSException(e.Message, StatusCodes.Status401Unauthorized);
            }
        }

        private async Task<User> getUserFromAccessToken()
        {
            var accessToken = HttpContext.Request.Headers["Authorization"].FirstOrDefault().Split(" ").Last();
            if (string.IsNullOrWhiteSpace(accessToken))
                return null;

            var (principal, jwtToken) = jwtAuthManager.DecodeJwtToken(accessToken);

            var userId = Guid.Parse(jwtToken.Claims.First(x => x.Type == "Id").Value);
            return await userService.GetUser(userId).ConfigureAwait(false);
        }
    }
}
