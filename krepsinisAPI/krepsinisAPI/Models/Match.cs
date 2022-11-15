using System.ComponentModel.DataAnnotations.Schema;

namespace krepsinisAPI.Models
{
    public class Match
    {
        public int MatchId { get; set; }
        public int HomeTeamScore { get; set; }
        public int AwayTeamScore { get; set; }
        public DateTime MatchDate { get; set; }
        public int? HomeTeamId { get; set; }

        [ForeignKey("HomeTeamId")]
        public Team? HomeTeam { get; set; }
        public int? AwayTeamId { get; set; }
        [ForeignKey("AwayTeamId")]
        public Team? AwayTeam { get; set; }
        public int? TournamentId { get; set; }
        [ForeignKey("TournamentId")]
        public Tournament? Tournament { get; set; }
    }
}
