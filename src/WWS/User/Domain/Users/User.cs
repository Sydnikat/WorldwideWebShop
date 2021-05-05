using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Users
{
    public class User
    {
        public User(string _id, Guid id, string userName, string password, string userFullName, List<string> roles, Email email, Address address, Phone phone)
        {
            UserName = userName;
            Password = password;
            Roles = roles;
            Email = email;
            UserFullName = userFullName;
            this._id = _id;
            Id = id;
            Address = address;
            Phone = phone;
        }

        public string _id { get; set; }
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string UserFullName { get; set; }
        public List<string> Roles { get; set; }
        public Email Email { get; set; }
        public Address Address { get; set; }
        public Phone Phone { get; set; }
    }
}
