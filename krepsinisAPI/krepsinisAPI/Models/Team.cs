using krepsinisAPI.Auth.Model;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace krepsinisAPI.Models
{
    public class Team : IUserOwnedResource
    {
        public int TeamId { get; set; }
        public string? Name { get; set; }
        public string? Arena { get; set; }

        public DateTime DateFounded { get; set; }
        //public List<Player>? Players { get; set; }
        public string? UserId { get; set; }
        [ForeignKey("UserId")]
        public User? User { get; set; }
    }
}
