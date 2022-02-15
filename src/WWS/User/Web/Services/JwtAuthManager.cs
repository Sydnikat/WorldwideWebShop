using Domain.Users;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Web.Config;

namespace Web.Services
{
    public class JwtAuthManager : IJwtAuthManager
    {
        public IImmutableDictionary<string, RefreshToken> UsersRefreshTokensReadOnlyDictionary => usersRefreshTokens.ToImmutableDictionary();
        private readonly ConcurrentDictionary<string, RefreshToken> usersRefreshTokens;  // TODO: store in a database
        private readonly IJwtTokenConfig jwtTokenConfig;
        private readonly byte[] secret;

        public JwtAuthManager(IJwtTokenConfig jwtTokenConfig)
        {
            this.jwtTokenConfig = jwtTokenConfig;
            usersRefreshTokens = new ConcurrentDictionary<string, RefreshToken>();
            secret = Encoding.ASCII.GetBytes(jwtTokenConfig.Secret);
        }

        public JwtAuthResult GenerateTokens(User user)
        {
            var claims = new[] {
                    new Claim("Id", user.Id.ToString()),
                    new Claim("Roles", string.Join(" ", user.Roles)),
                    new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                    new Claim("FullName", user.UserFullName)
                };

            return GenerateTokens(user.UserName, claims, DateTime.Now);
        }

        public JwtAuthResult Refresh(string refreshToken, string accessToken, DateTime now)
        {
            var (principal, jwtToken) = DecodeJwtToken(token: accessToken, validateLifteTime: false);
            if (jwtToken == null || !jwtToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256Signature))
                throw new SecurityTokenException("Invalid jwt token");

            if (!usersRefreshTokens.TryGetValue(refreshToken, out var existingRefreshToken))
                throw new SecurityTokenException("Refresh token not found");

            var userName = jwtToken.Claims.First(x => x.Type == "sub").Value;
            if (existingRefreshToken.UserName != userName || existingRefreshToken.ExpireAt < now)
                throw new SecurityTokenException("Invalid refresh token");

            var newAccessToken = genarateAccessTokenString(jwtToken.Claims.ToArray(), now);

            return new JwtAuthResult
            {
                AccessToken = newAccessToken,
                RefreshToken = existingRefreshToken
            };
        }

        public (ClaimsPrincipal, JwtSecurityToken) DecodeJwtToken(string token, bool validateLifteTime)
        {
            if (string.IsNullOrWhiteSpace(token))
                throw new SecurityTokenException("Invalid token");

            var principal = new JwtSecurityTokenHandler()
                .ValidateToken(token,
                    new TokenValidationParameters
                    {
                        ValidateIssuer = false,
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(secret),
                        ValidateAudience = false,
                        ValidateLifetime = validateLifteTime,
                        ClockSkew = TimeSpan.Zero
                    },
                    out var validatedToken);
            return (principal, validatedToken as JwtSecurityToken);
        }

        private JwtAuthResult GenerateTokens(string username, Claim[] claims, DateTime now)
        {
            var accessToken = genarateAccessTokenString(claims, now);
            var refreshToken = new RefreshToken
            {
                UserName = username,
                TokenString = generateRefreshTokenString(),
                ExpireAt = now.AddMinutes(jwtTokenConfig.RefreshTokenExpiration)
            };
            usersRefreshTokens.AddOrUpdate(refreshToken.TokenString, refreshToken, (s, t) => refreshToken);

            return new JwtAuthResult
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }

        private string genarateAccessTokenString(Claim[] claims, DateTime now)
        {
            var jwtToken = new JwtSecurityToken(
                claims: claims,
                expires: now.AddMinutes(jwtTokenConfig.AccessTokenExpiration),
                signingCredentials: new SigningCredentials(new SymmetricSecurityKey(secret), SecurityAlgorithms.HmacSha256Signature));
            var accessToken = new JwtSecurityTokenHandler().WriteToken(jwtToken);
            return accessToken;
        }

        private static string generateRefreshTokenString()
        {
            var randomNumber = new byte[32];
            using var randomNumberGenerator = RandomNumberGenerator.Create();
            randomNumberGenerator.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }
}
