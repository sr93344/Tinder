using System.ComponentModel.DataAnnotations;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required]
        public string DisplayName { get; set; } = "";

        [Required]
        [EmailAddress]
        public string Email { get; set; } = "";

        [Required]
        [MinLength(4), MaxLength(8)]
        public string Password { get; set; } = "";

        [Required, Compare("Password", ErrorMessage = "Passwords do not match.")]
        public string ConfirmPassword { get; set; } = "";

        [Required]
        public string Gender { get; set; } = "";

        [Required]
        public DateOnly DateOfBirth { get; set; }

        [Required]
        public string City { get; set; } = "";

        [Required]
        public string Country { get; set; } = "";
    }
}
