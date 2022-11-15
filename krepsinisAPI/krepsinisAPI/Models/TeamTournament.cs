using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace krepsinisAPI.Models
{
    [PrimaryKey(nameof(TeamId), nameof(TournamentId))]
    public class TeamTournament
    {
        public int TeamId { get; set; }
        [ForeignKey("TeamId")]
        public Team? Team { get; set; }
        public int TournamentId { get; set; }
        [ForeignKey("TournamentId")]
        public Tournament? Tournament { get; set; }
    }
}
