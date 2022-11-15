using System.ComponentModel.DataAnnotations.Schema;

namespace krepsinisAPI.Models
{
    public class Injury
    {
        public int InjuryId { get; set; }
        public string? Name { get; set; }
        public DateTime InjuryDate { get; set; }
        public int? PlayerId { get; set; }
        [ForeignKey("PlayerId")]
        public Player? Player { get; set; }
    }
}
