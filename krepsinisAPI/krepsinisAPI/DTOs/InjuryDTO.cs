namespace krepsinisAPI.DTOs
{
    public record CreateInjuryDTO(string name);

    public record UpdateInjuryDTO(string name);
    public record InjuryDTO(int id, string name, DateTime creationDate);
}
