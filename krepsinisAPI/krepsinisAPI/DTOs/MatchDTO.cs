namespace krepsinisAPI.DTOs
{
    public record CreateMatchDTO(int homeTeamScore, int awayTeamScore, int? firstTeamId, int? secondTeamId, DateTime matchDate);

    public record UpdateMatchDTO(int homeTeamScore, int awayTeamScore, int? firstTeamId, int? secondTeamId, DateTime matchDate);
    public record MatchDTO(int id, int homeTeamScore, int awayTeamScore, int? tournamentId, DateTime matchDate, int? homeTeamId, int? awayTeamId, string homeTeamName, string awayTeamName, string arena, string username, string userId);
}
