namespace krepsinisAPI.DTOs
{
    public record CreateMatchDTO(int homeTeamScore, int awayTeamScore, int? firstTeamId, int? secondTeamId);

    public record UpdateMatchDTO(int homeTeamScore, int awayTeamScore, int? firstTeamId, int? secondTeamId);
    public record MatchDTO(int id, int homeTeamScore, int awayTeamScore, int? tournamentId, DateTime matchDate, int? firstTeamId, int? secondTeamId);
}
