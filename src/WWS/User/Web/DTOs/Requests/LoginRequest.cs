using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.DTOs.Requests
{
    public class LoginRequest
    {
        public enum UserRole
        {
            Admin,
            Customer
        }

        public string UserName { get; set; }
        public string Password { get; set; }
        public UserRole Role { get; set; }
    }
}
