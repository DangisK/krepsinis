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

namespace krepsinisAPI.Controllers
{
    [ApiController]
    [Route("api/teams/{teamId}/players")]
    public class PlayersController : ControllerBase
    {
        private readonly BasketballDbContext _context;

        public PlayersController(BasketballDbContext context)
        {
            _context = context;
        }

        // GET: api/Players
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Player>>> GetPlayers(int teamId)
        {
            var team = await _context.Teams.FindAsync(teamId);
            if (team == null) return NotFound();

            var players = await _context.Players.Where(player => teamId == player.TeamId).ToListAsync();

            return Ok(players);
        }

        // GET: api/Players/5
        [HttpGet("{playerId}")]
        public async Task<ActionResult<PlayerDTO>> GetPlayer(int teamId, int playerId)
        {
            var team = await _context.Teams.FindAsync(teamId);
            if (team == null) return NotFound();

            var player = await _context.Players.FindAsync(playerId);
            if (player == null) return NotFound();

            return new PlayerDTO(player.PlayerId, player.Name, player.Surname, teamId);
        }

        // PUT: api/Players/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{playerId}")]
        public async Task<IActionResult> PutPlayer(int playerId, Player player)
        {
            if (playerId != player.PlayerId)
            {
                return BadRequest();
            }

            _context.Entry(player).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PlayerExists(playerId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Players
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<PlayerDTO>> PostPlayer(int teamId, CreatePlayerDTO player)
        {
            var team = await _context.Teams.FindAsync(teamId);
            if (team == null) return NotFound();

            var newPlayer = new Player() { Name = player.name, Surname = player.surname, Points = 0, Assists = 0, Rebounds = 0, TotalGames = 0, Team = team };
            _context.Players.Add(newPlayer);
            await _context.SaveChangesAsync();

            return Created($"/api/teams/{team.TeamId}/players/{newPlayer.PlayerId}", player);
        }

        // DELETE: api/Players/5
        [HttpDelete("{playerId}")]
        public async Task<IActionResult> DeletePlayer(int playerId)
        {
            var player = await _context.Players.FindAsync(playerId);
            if (player == null)
            {
                return NotFound();
            }

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
