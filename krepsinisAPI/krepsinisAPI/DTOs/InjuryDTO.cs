namespace krepsinisAPI.DTOs
{
    public record CreateInjuryDTO(string name, DateTime injuryDate);

    public record UpdateInjuryDTO(string name, DateTime injuryDate);
    public record InjuryDTO(int id, string name, DateTime injuryDate, int playerId, string username, string userId);
}
