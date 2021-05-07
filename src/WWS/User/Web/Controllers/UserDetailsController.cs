using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Controllers.DTOs.Responses;
using Web.Services;

namespace Web.Controllers
{
    [Route("internal/users")]
    [ApiController]
    public class UserDetailsController : WWSControllerBase
    {
        private readonly IUserService userService;

        public UserDetailsController(IUserService userService)
        {
            this.userService = userService;
        }

        [Route("{id}")]
        [HttpGet]
        public async Task<ActionResult<UserResponse>> GetUserDetails(Guid id)
        {
            var user = await userService.GetUser(id: id).ConfigureAwait(false);

            if (user != null)
                return Ok(UserResponse.Of(user));

            return BadRequest();
        }
    }
}
