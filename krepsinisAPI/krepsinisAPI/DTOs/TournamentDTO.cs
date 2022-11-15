namespace krepsinisAPI.DTOs
{
    public record CreateTournamentDTO(string name, DateTime startDate, int monthsDuration);

    public record UpdateTournamentDTO(string name, DateTime startDate, int monthsDuration);
    public record TournamentDTO(int id, string name, DateTime startDate, DateTime endDate);
}
