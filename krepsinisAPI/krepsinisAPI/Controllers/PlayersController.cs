using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using krepsinisAPI.Context;
using krepsinisAPI.Models;
using krepsinisAPI.DTOs;
using krepsinisAPI.Auth.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;

namespace krepsinisAPI.Controllers
{
    [ApiController]
    [Route("api/teams/{teamId}/players")]
    public class PlayersController : ControllerBase
    {
        private readonly BasketballDbContext _context;
        private readonly IAuthorizationService _authorizationService;
        private readonly UserManager<User> _userManager;

        public PlayersController(BasketballDbContext context, UserManager<User> userManager, IAuthorizationService authorizationService)
        {
            _context = context;
            _userManager = userManager;
            _authorizationService = authorizationService;
        }

        // GET: api/Players
        [HttpGet]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<IEnumerable<PlayerDTO>>> GetPlayers(int teamId)
        {
            var team = await _context.Teams.FindAsync(teamId);
            if (team == null) return NotFound();

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));

            var players = await _context.Players.Where(player => teamId == player.TeamId).ToListAsync();

            List<PlayerDTO> adminDTOs = new List<PlayerDTO>();
            for (int i = 0; i < players.Count; i++)
            {
                var player = players[i];
                PlayerDTO playerDTO = new PlayerDTO(player.PlayerId, player.Name, player.Surname, player.Points, player.Assists, player.Rebounds, player.TotalGames, player.Team.Name, teamId,
                _userManager.Users.FirstOrDefault(user => user.Id == player.UserId)?.NormalizedUserName,
                _userManager.Users.FirstOrDefault(user => user.Id == player.UserId)?.Id);
                adminDTOs.Add(playerDTO);
            }
            if (user.NormalizedUserName == "ADMIN") return Ok(adminDTOs);

            var userDTOs = adminDTOs.Where((dto) => dto.userId == user.Id);

            return Ok(userDTOs);
        }

        // GET: api/Players/5
        [HttpGet("{playerId}")]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<PlayerDTO>> GetPlayer(int teamId, int playerId)
        {
            var team = await _context.Teams.FindAsync(teamId);
            if (team == null) return NotFound();

            var player = await _context.Players.FindAsync(playerId);
            if (player == null) return NotFound();
            if (player.Team == null) return NotFound();
            if (player.Team.TeamId != teamId) return NotFound();

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));
            var normalizedUsername = _userManager.Users.FirstOrDefault(user => user.Id == player.UserId)?.NormalizedUserName;
            var userId = _userManager.Users.FirstOrDefault(user => user.Id == player.UserId)?.Id;

            PlayerDTO playerDTO = new PlayerDTO(player.PlayerId, player.Name, player.Surname, player.Points, player.Assists, player.Rebounds, player.TotalGames, player.Team.Name, teamId, normalizedUsername, userId);

            if (user.NormalizedUserName == "ADMIN") return playerDTO;
            if (user.Id != player.UserId) return NotFound();

            return Ok(playerDTO);
        }

        // PUT: api/Players/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{playerId}")]
        [Authorize(Roles = Roles.User)]
        public async Task<IActionResult> PutPlayer(int teamId, int playerId, UpdatePlayerDTO updatePlayerDTO)
        {
            var team = await _context.Teams.FindAsync(teamId);
            if (team == null) return NotFound();

            var player = await _context.Players.FindAsync(playerId);
            if (player == null) return NotFound();

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));
            if (user.Id != player.UserId && user.NormalizedUserName != "ADMIN") return NotFound();

            player.Name = updatePlayerDTO.name;
            player.Surname = updatePlayerDTO.surname;
            player.Points = updatePlayerDTO.points;
            player.Assists = updatePlayerDTO.assists;
            player.Rebounds = updatePlayerDTO.rebounds;
            player.TotalGames = updatePlayerDTO.totalGames;
            await _context.SaveChangesAsync();

            var normalizedUsername = _userManager.Users.FirstOrDefault(user => user.Id == player.UserId)?.NormalizedUserName;
            var userId = _userManager.Users.FirstOrDefault(user => user.Id == player.UserId)?.Id;

            return Ok(new PlayerDTO(player.PlayerId, player.Name, player.Surname, player.Points, player.Assists, player.Rebounds, player.TotalGames, team.Name, teamId, normalizedUsername, userId));
        }

        // POST: api/Players
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<PlayerDTO>> PostPlayer(int teamId, CreatePlayerDTO player)
        {
            var team = await _context.Teams.FindAsync(teamId);
            if (team == null) return NotFound();

            var newPlayer = new Player() { Name = player.name, Surname = player.surname, Points = player.points, Assists = player.assists, Rebounds = player.rebounds, TotalGames = player.totalGames, Team = team, UserId = User.FindFirstValue(JwtRegisteredClaimNames.Sub) };
            _context.Players.Add(newPlayer);
            await _context.SaveChangesAsync();

            var normalizedUsername = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub)).NormalizedUserName;
            var userId = _userManager.Users.FirstOrDefault(user => user.Id == newPlayer.UserId)?.Id;

            return Ok(new PlayerDTO(newPlayer.PlayerId, newPlayer.Name, newPlayer.Surname, newPlayer.Points, newPlayer.Assists, newPlayer.Rebounds, newPlayer.TotalGames, newPlayer.Team.Name, newPlayer.Team.TeamId, normalizedUsername, userId));
        }

        // DELETE: api/Players/5
        [HttpDelete("{playerId}")]
        [Authorize(Roles = Roles.User)]
        public async Task<IActionResult> DeletePlayer(int teamId, int playerId)
        {
            var team = await _context.Teams.FindAsync(teamId);
            if (team == null) return NotFound();

            var player = await _context.Players.FindAsync(playerId);
            if (player == null)
            {
                return NotFound();
            }

            if (team.TeamId != player.TeamId) return NotFound();

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));
            if (user.Id != player.UserId && user.NormalizedUserName != "ADMIN") return NotFound();

            _context.Players.Remove(player);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PlayerExists(int id)
        {
            return _context.Players.Any(e => e.PlayerId == id);
        }
    }
}
