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
    [Route("api/players/{playerId}/injuries")]
    [ApiController]
    public class InjuriesController : ControllerBase
    {
        private readonly BasketballDbContext _context;

        public InjuriesController(BasketballDbContext context)
        {
            _context = context;
        }

        // GET: api/Injuries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Injury>>> GetInjuries(int playerId)
        {
            var player = await _context.Players.FindAsync(playerId);
            if (player == null) return NotFound();

            return await _context.Injuries.Where(injury => injury.PlayerId == playerId).ToListAsync();
        }

        // GET: api/Injuries/5
        [HttpGet("{injuryId}")]
        public async Task<ActionResult<Injury>> GetInjury(int playerId, int injuryId)
        {
            var player = await _context.Players.FindAsync(playerId);
            if (player == null) return NotFound();

            var injury = await _context.Injuries.FindAsync(injuryId);

            if (injury == null && injury?.PlayerId != playerId)
            {
                return NotFound();
            }

            return injury;
        }

        // PUT: api/Injuries/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{injuryId}")]
        public async Task<IActionResult> PutInjury(int injuryId, Injury injury)
        {
            if (injuryId != injury.InjuryId)
            {
                return BadRequest();
            }

            _context.Entry(injury).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!InjuryExists(injuryId))
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

        // POST: api/Injuries
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Injury>> PostInjury(CreateInjuryDTO injury, int playerId)
        {
            var player = await _context.Players.FindAsync(playerId);

            if (player == null) return NotFound();

            var newInjury = new Injury() { InjuryDate = DateTime.UtcNow, Name = injury.name, Player = player } ;

            _context.Injuries.Add(newInjury);
            await _context.SaveChangesAsync();

            return Created($"/api/players/{player.PlayerId}/players/{newInjury.InjuryId}", newInjury);
        }

        // DELETE: api/Injuries/5
        [HttpDelete("{injuryId}")]
        public async Task<IActionResult> DeleteInjury(int injuryId)
        {
            var injury = await _context.Injuries.FindAsync(injuryId);
            if (injury == null)
            {
                return NotFound();
            }

            _context.Injuries.Remove(injury);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool InjuryExists(int id)
        {
            return _context.Injuries.Any(e => e.InjuryId == id);
        }
    }
}
