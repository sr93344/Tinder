namespace API.Entities
{
    public class AppUser
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public required string DisplayName { get; set; }
        public required string Email { get; set; }
        public string? ImageUrl { get; set; }          // add this
        public string? AuthProvider { get; set; }      // "local" or "google"
        public byte[]? PasswordHash { get; set; }      // make nullable
        public byte[]? PasswordSalt { get; set; }      // make nullable
    }
}
