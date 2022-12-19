namespace krepsinisAPI.DTOs
{
    public record CreateTournamentDTO(string name, DateTime startDate, DateTime endDate);

    public record UpdateTournamentDTO(string name, DateTime startDate, DateTime endDate);
    public record TournamentDTO(int tournamentId, string name, DateTime startDate, DateTime endDate, string username, string userId);
}
