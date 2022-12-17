﻿namespace krepsinisAPI.DTOs
{
    public record CreatePlayerDTO(string name, string surname);

    public record UpdatePlayerDTO(string name, string surname);
    public record PlayerDTO(int id, string name, string surname, int points, int assists, int rebounds, int totalGames, string teamName, int teamId);
}
