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
    [Route("api/tournaments/{tournamentId}/matches")]
    [ApiController]
    public class MatchesController : ControllerBase
    {
        private readonly BasketballDbContext _context;

        public MatchesController(BasketballDbContext context)
        {
            _context = context;
        }

        // GET: api/Matches
        [HttpGet]
        [ResponseCache(Duration = 60)]
        public async Task<ActionResult<IEnumerable<Match>>> GetMatches()
        {
            return await _context.Matches.ToListAsync();
        }

        // GET: api/Matches/5
        [HttpGet("{matchId}")]
        public async Task<ActionResult<Match>> GetMatch(int matchId)
        {
            var match = await _context.Matches.FindAsync(matchId);

            if (match == null)
            {
                return NotFound();
            }

            return match;
        }

        // PUT: api/Matches/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{matchId}")]
        public async Task<IActionResult> PutMatch(int matchId, Match match)
        {
            if (matchId != match.MatchId)
            {
                return BadRequest();
            }

            _context.Entry(match).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MatchExists(matchId))
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

        // POST: api/Matches
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Match>> PostMatch(int tournamentId, CreateMatchDTO match)
        {
            var homeTeam = await _context.Teams.FindAsync(match.firstTeamId);
            if (homeTeam == null) return NotFound("Home team not found");
            var awayTeam = await _context.Teams.FindAsync(match.secondTeamId);
            if (awayTeam == null) return NotFound("Away team not found");
            var tournament = await _context.Tournaments.FindAsync(tournamentId);
            if (tournament == null) return NotFound("Tournament team not found");

            if (match.firstTeamId == match.secondTeamId) return NotFound("Matching first and second team IDs");

            var newMatch = new Match () { AwayTeamScore = match.awayTeamScore, HomeTeamScore = match.homeTeamScore, MatchDate = DateTime.UtcNow, TournamentId = tournamentId, Tournament = tournament, HomeTeam = homeTeam, AwayTeam = awayTeam };
            _context.Matches.Add(newMatch);
            await _context.SaveChangesAsync();

            return Created($"/api/tournaments/{tournament.TournamentId}/matches/{newMatch.MatchId}", newMatch);
        }

        // DELETE: api/Matches/5
        [HttpDelete("{matchId}")]
        public async Task<IActionResult> DeleteMatch(int matchId)
        {
            var match = await _context.Matches.FindAsync(matchId);
            if (match == null)
            {
                return NotFound();
            }

            _context.Matches.Remove(match);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MatchExists(int id)
        {
            return _context.Matches.Any(e => e.MatchId == id);
        }
    }
}
