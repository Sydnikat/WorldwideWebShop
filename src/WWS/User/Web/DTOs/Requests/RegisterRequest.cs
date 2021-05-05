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
        public AddressRequest Address { get; set; }
        public string Phone { get; set; }

        public User ToNewUser()
            => new User(
                _id: null,
                id: Guid.Empty,
                userName: UserName,
                password: Password,
                userFullName: UserFullName,
                roles: new List<string>(),
                email: new Email(value: Email, confirmed: false),
                address: Address.ToAddress(),
                phone: new Phone(value: Phone, confirmed: false)
                );
    }
}
