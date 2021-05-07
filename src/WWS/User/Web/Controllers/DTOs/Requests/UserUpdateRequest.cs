using Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Controllers.DTOs.Requests
{
    public class UserUpdateRequest
    {
        public UserUpdateRequest(string userFullName, AddressUpdateRequest address, string phone)
        {
            UserFullName = userFullName;
            Address = address;
            Phone = phone;
        }

        public string UserFullName { get; set; }
        public AddressUpdateRequest Address { get; set; }
        public string Phone { get; set; }

        public User ToPatchData()
            => new User(
                _id: "",
                id: Guid.Empty,
                userName: "",
                userFullName: UserFullName,
                password: "",
                roles: new List<string>(),
                email: new Email("", false),
                address: Address.ToAddress(),
                phone: new Phone(Phone, false)
                );
    }
}
