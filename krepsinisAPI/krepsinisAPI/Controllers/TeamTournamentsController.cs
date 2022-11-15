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
    [Route("api/tournaments/{tournamentId}/teams")]
    [ApiController]
    public class TeamTournamentsController : ControllerBase
    {
        private readonly BasketballDbContext _context;

        public TeamTournamentsController(BasketballDbContext context)
        {
            _context = context;
        }

        // GET: api/TeamTournaments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeamTournament>>> GetTeamTournaments(int tournamentId)
        {
            var tournament = _context.Tournaments.Find(tournamentId);
            if (tournament == null) return NotFound();
            return await _context.TeamTournaments.Where(team => team.TournamentId == tournamentId).Include(team => team.Team).ToListAsync();
        }

        // GET: api/TeamTournaments/5
        [HttpGet("{teamId}")]
        public async Task<ActionResult<TeamTournament>> GetTeamTournament(int teamId, int tournamentId)
        {
            var teamTournament = await _context.TeamTournaments.FindAsync(teamId);

            if (teamTournament == null)
            {
                return NotFound();
            }

            return teamTournament;
        }

        // PUT: api/TeamTournaments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{teamId}")]
        public async Task<IActionResult> PutTeamTournament(int teamId, int tournamentId, TeamTournament teamTournament)
        {
            if (teamId != teamTournament.TeamId || tournamentId != teamTournament.TournamentId)
            {
                return BadRequest();
            }

            _context.Entry(teamTournament).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TeamTournamentExists(teamId, tournamentId))
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

        // POST: api/TeamTournaments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost("{teamId}")]
        public async Task<ActionResult<TeamTournament>> PostTeamTournament(int tournamentId, int teamId)
        {
            var tournament = await _context.Tournaments.FindAsync(teamId);
            if (tournament == null) return NotFound();
            var team = await _context.Teams.FindAsync(teamId);
            if (team == null) return NotFound();
            var teamTournament = await _context.TeamTournaments.FindAsync(teamId, tournamentId);
            if (teamTournament != null) return NotFound();

            var newTeamTournament = new TeamTournament() { TeamId = teamId, TournamentId = tournamentId };
            _context.TeamTournaments.Add(newTeamTournament);
            await _context.SaveChangesAsync();

            return Created($"/api/tournaments/{tournamentId}/teams/{teamId}", newTeamTournament);
        }

        // DELETE: api/TeamTournaments/5
        [HttpDelete("{teamId}")]
        public async Task<IActionResult> DeleteTeamTournament(int teamId, int tournamentId)
        {
            var teamTournament = await _context.TeamTournaments.FindAsync(teamId);
            if (teamTournament == null)
            {
                return NotFound();
            }

            _context.TeamTournaments.Remove(teamTournament);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TeamTournamentExists(int teamId, int tournamentId)
        {
            return _context.TeamTournaments.Any(e => e.TournamentId == tournamentId && e.TeamId == teamId);
        }
    }
}
