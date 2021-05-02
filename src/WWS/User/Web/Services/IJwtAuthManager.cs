using Domain.Users;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Web.Services
{
    public class RefreshToken
    {
        public string UserName { get; set; }
        public string TokenString { get; set; }
        public DateTime ExpireAt { get; set; }
    }

    public class JwtAuthResult
    {
        public string AccessToken { get; set; }
        public RefreshToken RefreshToken { get; set; }
    }

    public interface IJwtAuthManager
    {
        public JwtAuthResult GenerateTokens(User user);
        JwtAuthResult Refresh(string refreshToken, string accessToken, DateTime now);
        public (ClaimsPrincipal, JwtSecurityToken) DecodeJwtToken(string token);
    }
}
