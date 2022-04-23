using Dal.Users;
using Domain.Users;
using Isopoh.Cryptography.Argon2;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Services.Exceptions;

namespace Web.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository userRepository;
        private readonly INotificationService notificationService;

        public UserService(IUserRepository userRepository, INotificationService notificationService)
        {
            this.userRepository = userRepository;
            this.notificationService = notificationService;
        }

        public async Task<User> CreateUser(User patchData)
        {
            var existingUser = await userRepository.FindByUserName(patchData.UserName);
            if (existingUser != null)
                throw new UserAlreadyExistsException(patchData.UserName);

            var existingUserWithEmail = await userRepository.FindByEmail(patchData.Email.Value);
            if (existingUserWithEmail != null)
                throw new EmailAlreadyExistsException(patchData.Email.Value);

            var userRoles = new List<string>();
            userRoles.Add("Customer");

            var newUser = new User(
                _id: null,
                id: Guid.NewGuid(),
                userName: patchData.UserName,
                password: hashPassword(patchData.Password),
                userFullName: patchData.UserFullName,
                roles: userRoles,
                email: new Email(patchData.Email.Value, false),
                address: patchData.Address,
                phone: new Phone(patchData.Phone.Value, false)
                );

            var savedUser = await userRepository.Save(newUser).ConfigureAwait(false);
            Console.WriteLine($"user with id: ${savedUser.Id} was created...");

            if (savedUser != null)
                await notificationService.PublishUserRegisteredEvent(savedUser).ConfigureAwait(false);

            return savedUser;
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

        public async Task<User> UpdateUser(User user, User patchData)
        {
            user.UserFullName = patchData.UserFullName;
            user.Phone = patchData.Phone;
            user.Address = patchData.Address;
            return await userRepository.Update(user).ConfigureAwait(false);
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
