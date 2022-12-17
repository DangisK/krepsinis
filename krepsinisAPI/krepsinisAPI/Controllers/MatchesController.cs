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
        public async Task<ActionResult<IEnumerable<MatchDTO>>> GetMatches(int tournamentId)
        {
            var tournament = await _context.Tournaments.FindAsync(tournamentId);
            if (tournament == null) return NotFound();

            var matches = await _context.Matches.Where(match => tournamentId == match.TournamentId).ToListAsync();
            List<MatchDTO> matchDTOs = new List<MatchDTO>();
            for (int i = 0; i < matches.Count; i++)
            {
                var match = matches[i];
                var homeTeam= await _context.Teams.FindAsync(matches[i].HomeTeamId);
                var awayTeam = await _context.Teams.FindAsync(matches[i].AwayTeamId);
                MatchDTO matchDTO = new MatchDTO(match.MatchId, match.HomeTeamScore, match.AwayTeamScore, tournamentId, match.MatchDate, match.HomeTeamId, match.AwayTeamId, homeTeam.Name, awayTeam.Name, homeTeam.Arena);
                matchDTOs.Add(matchDTO);
            }

            return Ok(matchDTOs);
        }

        // GET: api/Matches/5
        [HttpGet("{matchId}")]
        public async Task<ActionResult<Match>> GetMatch(int tournamentId, int matchId)
        {
            var tournament = await _context.Tournaments.FindAsync(tournamentId);
            if (tournament == null) return NotFound();

            var match = await _context.Matches.FindAsync(matchId);
            if (match == null) return NotFound();

            if (match.TournamentId != tournamentId) return NotFound();

            return Ok(match);
        }

        // PUT: api/Matches/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{matchId}")]
        public async Task<IActionResult> PutMatch(int tournamentId, int matchId, UpdateMatchDTO updateMatchDTO)
        {
            var tournament = await _context.Tournaments.FindAsync(tournamentId);
            if (tournament == null) return NotFound();

            var match = await _context.Matches.FindAsync(matchId);
            if (match == null) return NotFound();

            //var authorizationResult = await authorizationService.AuthorizeAsync(User, contextTeam, PolicyNames.ResourceOwner);
            //if (!authorizationResult.Succeeded)
            //{
            //    return Forbid();
            //}

            match.MatchDate = updateMatchDTO.matchDate;
            match.HomeTeamId = updateMatchDTO.firstTeamId;
            match.AwayTeamId = updateMatchDTO.secondTeamId;
            match.HomeTeamScore = updateMatchDTO.homeTeamScore;
            match.AwayTeamScore = updateMatchDTO.awayTeamScore;

            await _context.SaveChangesAsync();

            var homeTeam = await _context.Teams.FindAsync(updateMatchDTO.firstTeamId);
            var awayTeam = await _context.Teams.FindAsync(updateMatchDTO.secondTeamId);
            var home = homeTeam.Name;
            var arena = homeTeam.Arena;
            var away = awayTeam.Name;

            return Ok(new MatchDTO(match.MatchId, match.HomeTeamScore, match.AwayTeamScore, tournamentId, updateMatchDTO.matchDate, match.HomeTeamId, match.AwayTeamId, home, away, arena));
            //if (matchId != match.MatchId)
            //{
            //    return BadRequest();
            //}

            //_context.Entry(match).State = EntityState.Modified;

            //try
            //{
            //    await _context.SaveChangesAsync();
            //}
            //catch (DbUpdateConcurrencyException)
            //{
            //    if (!MatchExists(matchId))
            //    {
            //        return NotFound();
            //    }
            //    else
            //    {
            //        throw;
            //    }
            //}

            //return NoContent();
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

            var newMatch = new Match () { AwayTeamScore = match.awayTeamScore, HomeTeamScore = match.homeTeamScore, MatchDate = match.matchDate, TournamentId = tournamentId, Tournament = tournament, HomeTeam = homeTeam, AwayTeam = awayTeam, AwayTeamId = awayTeam.TeamId, HomeTeamId = homeTeam.TeamId };
            _context.Matches.Add(newMatch);
            await _context.SaveChangesAsync();

            MatchDTO matchDTO = new MatchDTO(newMatch.MatchId, newMatch.HomeTeamScore, newMatch.AwayTeamScore, newMatch.TournamentId, newMatch.MatchDate, newMatch.HomeTeamId, newMatch.AwayTeamId, newMatch.HomeTeam.Name, newMatch.AwayTeam.Name, newMatch.HomeTeam.Arena);

            return Ok(matchDTO);
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
