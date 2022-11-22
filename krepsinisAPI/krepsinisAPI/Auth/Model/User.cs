using Microsoft.AspNetCore.Identity;

namespace krepsinisAPI.Auth.Model
{
    public class User : IdentityUser
    {
        [PersonalData]
        public string? AdditionalInfo { get; set; }
    }
}
