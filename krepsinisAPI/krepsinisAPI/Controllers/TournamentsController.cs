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
    [Route("api/tournaments")]
    [ApiController]
    public class TournamentsController : ControllerBase
    {
        private readonly BasketballDbContext _context;

        public TournamentsController(BasketballDbContext context)
        {
            _context = context;
        }

        // GET: api/Tournaments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Tournament>>> GetTournaments()
        {
            return await _context.Tournaments.ToListAsync();
        }

        // GET: api/Tournaments/5
        [HttpGet("{tournamentId}")]
        public async Task<ActionResult<Tournament>> GetTournament(int tournamentId)
        {
            var tournament = await _context.Tournaments.FindAsync(tournamentId);

            if (tournament == null)
            {
                return NotFound();
            }

            return tournament;
        }

        // PUT: api/Tournaments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{tournamentId}")]
        public async Task<IActionResult> PutTournament(int tournamentId, Tournament tournament)
        {
            if (tournamentId != tournament.TournamentId)
            {
                return BadRequest();
            }

            _context.Entry(tournament).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TournamentExists(tournamentId))
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

        // POST: api/Tournaments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TournamentDTO>> PostTournament(CreateTournamentDTO tournament)
        {
            var newTournament = new Tournament() { EndDate = tournament.startDate.AddMonths(tournament.monthsDuration), StartDate = tournament.startDate, Name = tournament.name };
            _context.Tournaments.Add(newTournament);
            await _context.SaveChangesAsync();

            var tournamentDTO = new TournamentDTO(newTournament.TournamentId, newTournament.Name, newTournament.StartDate, newTournament.EndDate);

            return Created($"/api/teams/{newTournament.TournamentId}", tournamentDTO);
        }

        // DELETE: api/Tournaments/5
        [HttpDelete("{tournamentId}")]
        public async Task<IActionResult> DeleteTournament(int tournamentId)
        {
            var tournament = await _context.Tournaments.FindAsync(tournamentId);
            if (tournament == null)
            {
                return NotFound();
            }

            _context.Tournaments.Remove(tournament);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TournamentExists(int id)
        {
            return _context.Tournaments.Any(e => e.TournamentId == id);
        }
    }
}
