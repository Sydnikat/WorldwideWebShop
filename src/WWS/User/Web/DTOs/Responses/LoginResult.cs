using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static Domain.Users.User;

namespace Web.DTOs.Responses
{
    public class LoginResult
    {
        public string UserName { get; set; }
        public UserRole Role { get; set; }
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
    }
}
