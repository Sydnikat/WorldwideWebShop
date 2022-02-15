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
    public class AuthController : WWSControllerBase
    {
        private readonly IUserService userService;

        public AuthController(IUserService userService, IJwtAuthManager jwtAuthManager)
            : base(jwtAuthManager)
        {
            this.userService = userService;
        }

        [AllowAnonymous]
        [HttpPost("signin")]
        public async Task<ActionResult<LoginResult>> Login([FromBody] LoginRequest request)
        {
            var user = await userService.GetUser(request.UserName).ConfigureAwait(false);

            if (user == null)
                return Unauthorized();

            if (!userService.IsValidUserCredentials(user, request.Password))
                return Unauthorized();

            var roles = new List<string>();
            var chosenRole = request.Role.ToString();
            if (user.Roles.Contains(chosenRole))
                roles.Add(chosenRole);
            else
                return Unauthorized();


            var jwtResult = jwtAuthManager.GenerateTokens(user);
            return Ok(new LoginResult
            {
                UserName = user.UserName,
                Roles = roles,
                AccessToken = jwtResult.AccessToken,
                RefreshToken = jwtResult.RefreshToken.TokenString,
                UserFullName = user.UserFullName,
                Id = user.Id
            });
        }

        [HttpPost("signup")]
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
        public async Task<ActionResult<RefreshTokenResult>> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.RefreshToken))
                return Unauthorized();

            var authorizationStr = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
            if (authorizationStr == null)
                return Unauthorized();

            var accessToken = authorizationStr.Split(" ").Last();
            if (string.IsNullOrWhiteSpace(accessToken))
                return Unauthorized();

            try
            {
                var jwtResult = jwtAuthManager.Refresh(request.RefreshToken, accessToken, DateTime.Now);

                return Ok(new RefreshTokenResult
                {
                    AccessToken = jwtResult.AccessToken
                });
            }
            catch (SecurityTokenException e)
            {
                throw new WWSSException(e.Message, StatusCodes.Status401Unauthorized);
            }
        }

        [HttpGet("check")]
        public async Task<ActionResult> VerifyJwtToken()
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
    }
}
