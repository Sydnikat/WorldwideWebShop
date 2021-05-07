using Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Services
{
    public interface IUserService
    {
        bool IsValidUserCredentials(User user, string password);
        Task<User> CreateUser(User patchData);
        Task<User> GetUser(string userName);
        Task<User> GetUser(Guid id);
        Task<User> UpdateUser(User user, User patchData);
    }
}
