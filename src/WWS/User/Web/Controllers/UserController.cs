using Common.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Controllers.DTOs.Requests;
using Web.Controllers.DTOs.Responses;
using Web.Services;
using static Web.Middlewares.ErrorHandlerMiddleware;

namespace Web.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : WWSControllerBase
    {
        private readonly IUserService userService;

        public UserController(IUserService userService, IJwtAuthManager jwtAuthManager) 
            : base(jwtAuthManager)
        {
            this.userService = userService;
        }

        [HttpGet("me")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UserResponse>> GetMyProfile()
        {
            try
            {
                var userMetaData = getUserFromAccessToken();
                if (userMetaData == null)
                    return Unauthorized();

                var user = await userService.GetUser(userName: userMetaData.UserName).ConfigureAwait(false);

                if (user == null)
                    throw new WWSSException("User not found", StatusCodes.Status500InternalServerError);

                return Ok(UserResponse.Of(user));
            }
            catch (SecurityTokenException e)
            {
                throw new WWSSException(e.Message, StatusCodes.Status401Unauthorized);
            }
        }

        [HttpPut("me")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UserResponse>> EditMyProfile([FromBody] UserUpdateRequest request)
        {
            try
            {
                var userMetaData = getUserFromAccessToken();
                if (userMetaData == null)
                    return Unauthorized();

                if (request == null)
                    throw new WWSSException("Request not found", StatusCodes.Status400BadRequest);

                var user = await userService.GetUser(userName: userMetaData.UserName).ConfigureAwait(false);

                if (user == null)
                    throw new WWSSException("User not found", StatusCodes.Status500InternalServerError);

                var updatedUser = await userService.UpdateUser(user, request.ToPatchData()).ConfigureAwait(false);

                return Ok(UserResponse.Of(updatedUser)); 
            }
            catch (SecurityTokenException e)
            {
                throw new WWSSException(e.Message, StatusCodes.Status401Unauthorized);
            }
        }
    }
}
