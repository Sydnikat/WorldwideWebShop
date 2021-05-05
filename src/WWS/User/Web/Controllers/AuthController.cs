using Common.DTOs;
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
using Web.Services.Exceptions;
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
                Roles = user.Roles,
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

            try
            {
                var savedUser = await userService.CreateUser(patchData).ConfigureAwait(false);

                if (savedUser != null)
                    return Ok();

                return BadRequest();
            }
            catch (UserAlreadyExistsException)
            {
                throw new WWSSException("Username is not available", StatusCodes.Status400BadRequest);
            }
            catch (EmailAlreadyExistsException)
            {
                throw new WWSSException("Email is already used", StatusCodes.Status400BadRequest);
            }
        }

        [HttpPost("refresh-token")]
        public async Task<ActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
                return Unauthorized();

            try
            {
                var accessToken = await HttpContext.GetTokenAsync("Bearer", "access_token");
                var userMetaData = getUserFromAccessToken();

                var jwtResult = jwtAuthManager.Refresh(request.RefreshToken, accessToken, DateTime.Now);

                return Ok(new LoginResult
                {
                    UserName = userMetaData.UserName,
                    Roles = userMetaData.Roles,
                    AccessToken = jwtResult.AccessToken,
                    RefreshToken = jwtResult.RefreshToken.TokenString
                });
            }
            catch (SecurityTokenException e)
            {
                throw new WWSSException(e.Message, StatusCodes.Status401Unauthorized);
            }
        }

        [HttpGet("check")]
        public ActionResult VerifyJwtToken()
        {
            try
            {
                var user = getUserFromAccessToken();
                if (user == null)
                    return Unauthorized();

                return Ok();
            }
            catch (SecurityTokenException e)
            {
                throw new WWSSException(e.Message, StatusCodes.Status401Unauthorized);
            }
        }

        private UserMetaData getUserFromAccessToken()
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
