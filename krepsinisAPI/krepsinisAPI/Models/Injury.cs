using krepsinisAPI.Auth.Model;
using Microsoft.Build.Framework;
using System.ComponentModel.DataAnnotations.Schema;

namespace krepsinisAPI.Models
{
    public class Injury : IUserOwnedResource
    {
        public int InjuryId { get; set; }
        public string? Name { get; set; }
        public DateTime InjuryDate { get; set; }
        public int? PlayerId { get; set; }
        [ForeignKey("PlayerId")]
        public Player? Player { get; set; }
        public string? UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}
