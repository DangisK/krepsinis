namespace krepsinisAPI.DTOs
{
    public record CreatePlayerDTO(string name, string surname, int points, int assists, int rebounds, int totalGames);
    public record UpdatePlayerDTO(string name, string surname, int points, int assists, int rebounds, int totalGames);
    public record PlayerDTO(int id, string name, string surname, int points, int assists, int rebounds, int totalGames, string teamName, int teamId, string username, string userId);
}
