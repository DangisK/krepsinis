namespace krepsinisAPI.DTOs
{
    public record CreateTeamDTO(string name, string arena);

    public record UpdateTeamDTO(string name, string arena);
    public record TeamDTO(int id, string name, string arena, DateTime dateFounded);
}
