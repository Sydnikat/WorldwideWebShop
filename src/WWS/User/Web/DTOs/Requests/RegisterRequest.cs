using Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.DTOs.Requests
{
    public class RegisterRequest
    {
        public string UserName { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }
        public string UserFullName { get; set; }
        public string Email { get; set; }

        public User ToNewUser()
            => new User(
                _id: null,
                id: Guid.Empty,
                userName: UserName,
                password: Password,
                userFullName: UserFullName,
                role: User.UserRole.Customer,
                email: new Email(value: Email, confirmed: false)
                );
    }
}
