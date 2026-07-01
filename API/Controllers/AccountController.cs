using API.Data;
using API.DTOs;
using API.Entities;
using API.Enums;
using API.Extensions;
using API.Interfaces;
using API.Services;
using Google.Apis.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace API.Controllers
{
    public class AccountController(AppDbContext context, ITokenService tokenService, IConfiguration config) : BaseApiController
    {
        // POST api/<AccountController>/register
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await EmailExists(registerDto.Email)) return BadRequest("Email already in use.");

            using var hmac = new HMACSHA512();

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                AuthProvider = AuthProvider.Local.ToString().ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key,
                Member = new Member
                {
                    DisplayName = registerDto.DisplayName,
                    Gender = registerDto.Gender,
                    DateOfBirth = registerDto.DateOfBirth,
                    City = registerDto.City,
                    Country = registerDto.Country
                }
            };

            context.Users.Add(user);
            await context.SaveChangesAsync();

            return user.ToDto(tokenService);
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await context.Users.SingleOrDefaultAsync(x => x.Email.ToLower() == loginDto.Email.ToLower());

            if (user == null) return Unauthorized("Invaild Email address.");

            // Prevent Google users from using password login
            if (user.AuthProvider == "google")
                return BadRequest("This account uses Google login. Please sign in with Google.");

            using var hmac = new HMACSHA512(user.PasswordSalt!);

            var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for(var i=0; i<computedHash.Length; i++)
            {
                if (computedHash[i] != user.PasswordHash![i]) return Unauthorized("Invalid Password.");
            }

            return user.ToDto(tokenService);
        }

        [HttpPost("google-login")]
        public async Task<ActionResult<UserDto>> GoogleLogin([FromBody] GoogleAuthDto dto)
        {
            // 1. Validate the Google token
            GoogleJsonWebSignature.Payload payload;
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = new[] { config["Google:ClientId"] }
                };
                payload = await GoogleJsonWebSignature.ValidateAsync(dto.IdToken, settings);
            }
            catch
            {
                return Unauthorized("Invalid Google token");
            }

            // 2. Check if user exists
            var user = await context.Users
                .FirstOrDefaultAsync(u => u.Email == payload.Email);

            // 3. If not, create them
            if (user == null)
            {
                user = new AppUser
                {
                    DisplayName = payload.Name,
                    Email = payload.Email,
                    ImageUrl = payload.Picture,
                    AuthProvider = AuthProvider.Google.ToString().ToLower()
                    // PasswordHash and PasswordSalt left null
                };
                context.Users.Add(user);
                await context.SaveChangesAsync();
            }

            // 4. Return your standard JWT response
            return new UserDto
            {
                Id = user.Id,
                DisplayName = user.DisplayName,
                Email = user.Email,
                ImageUrl = user.ImageUrl,
                Token = tokenService.CreateToken(user)  // your existing JWT service
            };
        }

        private async Task<bool> EmailExists(string email)
        {
            return await context.Users.AnyAsync(x => x.Email.ToLower() == email.ToLower());
        }
    }
}
