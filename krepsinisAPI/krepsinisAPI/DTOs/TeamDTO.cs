namespace krepsinisAPI.DTOs
{
    public record CreateTeamDTO(string name, string arena, DateTime dateFounded);

    public record UpdateTeamDTO(string name, string arena, DateTime dateFounded);
    public record TeamDTO(int id, string name, string arena, DateTime dateFounded, string username, string userId);
}
