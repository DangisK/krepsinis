using System.ComponentModel.DataAnnotations.Schema;

namespace krepsinisAPI.Models
{
    public class Player
    {
        public int PlayerId { get; set; }
        public string? Name { get; set; }
        public string? Surname { get; set; }
        public int Points { get; set; }
        public int Assists { get; set; }
        public int Rebounds { get; set; }
        public int TotalGames { get; set; }
        //public List<Injury>? Injuries { get; set; }
        public int TeamId { get; set; }
        [ForeignKey("TeamId")]
        public Team? Team { get; set; }
    }
}
