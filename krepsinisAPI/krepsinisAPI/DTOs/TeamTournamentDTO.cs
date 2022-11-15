namespace krepsinisAPI.DTOs
{
    public record CreateTeamTournamentDTO(int teamId, int tournamentId);

    public record UpdateTeamTournamentDTO(int teamId, int tournamentId);
    public record TeamTournamentDTO(int id, int teamId, int tournamentId, int teamTournamentId);
}
