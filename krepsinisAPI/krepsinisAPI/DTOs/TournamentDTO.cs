namespace krepsinisAPI.DTOs
{
    public record CreateTournamentDTO(string name, int monthsDuration);

    public record UpdateTournamentDTO(string name, int monthsDuration);
    public record TournamentDTO(int tournamentId, string name, DateTime startDate, DateTime endDate);
}
