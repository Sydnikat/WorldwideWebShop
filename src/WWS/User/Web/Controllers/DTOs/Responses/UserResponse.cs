using Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Controllers.DTOs.Responses
{
    public class UserResponse
    {
        public UserResponse(Guid id, string userName, string userFullName, string email, AddressResponse address, string phone)
        {
            Id = id;
            UserName = userName;
            UserFullName = userFullName;
            Email = email;
            Address = address;
            Phone = phone;
        }

        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string UserFullName { get; set; }
        public string Email { get; set; }
        public AddressResponse Address { get; set; }
        public string Phone { get; set; }

        public static UserResponse Of(User user)
            => new UserResponse(
                id: user.Id,
                userName: user.UserName,
                userFullName: user.UserFullName,
                email: user.Email.Value,
                phone: user.Phone.Value,
                address: AddressResponse.Of(user.Address)
                );
    }
}
