using Dal.Users;
using Domain.Users;
using Isopoh.Cryptography.Argon2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository userRepository;

        public UserService(IUserRepository userRepository)
        {
            this.userRepository = userRepository;
        }

        public async Task<User> CreateUser(User patchData)
        {
            var newUser = new User(
                _id: null,
                id: Guid.NewGuid(),
                userName: patchData.UserName,
                password: hashPassword(patchData.Password),
                userFullName: patchData.UserFullName,
                role: User.UserRole.Customer,
                email: new Email(patchData.Email.Value, false)
                );

            return await userRepository.Save(newUser).ConfigureAwait(false);
        }

        public async Task<User> GetUser(string userName)
        {
            return await userRepository.FindByUserName(userName).ConfigureAwait(false);
        }

        public async Task<User> GetUser(Guid id)
        {
            return await userRepository.FindById(id).ConfigureAwait(false);
        }

        public bool IsValidUserCredentials(User user, string password)
        {
            return verifyHashedPassword(user.Password, password);
        }
        private string hashPassword(string password)
        {
            return Argon2.Hash(password);
        }

        private bool verifyHashedPassword(string hashedPassword, string providedPassword)
        {
            return Argon2.Verify(hashedPassword, providedPassword);
        }
    }
}
