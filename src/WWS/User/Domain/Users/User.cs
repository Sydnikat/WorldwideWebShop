using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Users
{
    public class User
    {
        public User(string _id, Guid id, string userName, string password, string userFullName, UserRole role, Email email)
        {
            UserName = userName;
            Password = password;
            Role = role;
            Email = email;
            UserFullName = userFullName;
            this._id = _id;
            Id = id;
        }

        public enum UserRole
        {
            Customer,
            Admin
        }
        public string _id { get; set; }
        public Guid Id { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string UserFullName { get; set; }
        public UserRole Role { get; set; }
        public Email Email { get; set; }
    }
}
