using Refit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.UserClient.DTOs;

namespace Web.UserClient
{
    public interface IUserApiClient
    {
        [Get("/internal/users/{id}")]
        Task<UserResponse> GetUserDetails([AliasAs("id")] string userId);
    }
}
