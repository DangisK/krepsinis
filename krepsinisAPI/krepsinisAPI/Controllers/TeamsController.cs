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
using Microsoft.AspNetCore.Authorization;
using krepsinisAPI.Auth.Model;
using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;

namespace krepsinisAPI.Controllers
{
    [Route("api/teams")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly BasketballDbContext _context;
        private readonly IAuthorizationService authorizationService;

        public TeamsController(BasketballDbContext context, IAuthorizationService authorizationService)
        {
            _context = context;
            this.authorizationService = authorizationService;
        }

        // GET: api/Teams
        [HttpGet]
        [ResponseCache(Duration = 60)]
        public async Task<ActionResult<IEnumerable<TeamDTO>>> GetTeams()
        {
            var teams = await _context.Teams.ToListAsync();
            var teamsDTOs = teams.Select(team => new TeamDTO(team.TeamId, team.Name, team.Arena, team.DateFounded));

            return Ok(teamsDTOs);
        }

        // GET: api/Teams/5
        [HttpGet("{teamId}")]
        public async Task<ActionResult<TeamDTO>> GetTeam(int teamId)
        {
            var team = await _context.Teams.FindAsync(teamId);

            if (team == null)
            {
                return NotFound();
            }

            var teamDTO = new TeamDTO(team.TeamId, team.Name, team.Arena, dateFounded: DateTime.UtcNow);

            return teamDTO;
        }

        // PUT: api/Teams/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{teamId}")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> PutTeam(int teamId, UpdateTeamDTO teamDTO)
        {
            var contextTeam = await _context.Teams.FindAsync(teamId);

            if (contextTeam == null) return NotFound();

            var authorizationResult = await authorizationService.AuthorizeAsync(User, contextTeam, PolicyNames.ResourceOwner);
            if (!authorizationResult.Succeeded)
            {
                return Forbid();
            }

            contextTeam.Arena = teamDTO.arena;
            contextTeam.Name = teamDTO.name;
            await _context.SaveChangesAsync();

            return Ok(new TeamDTO(teamId, contextTeam.Name, contextTeam.Arena, contextTeam.DateFounded));

            //if (teamId != team.TeamId)
            //{
            //    return BadRequest();
            //}

            //_context.Entry(team).State = EntityState.Modified;

            //try
            //{
            //    await _context.SaveChangesAsync();
            //}
            //catch (DbUpdateConcurrencyException)
            //{
            //    if (!TeamExists(teamId))
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

        // POST: api/Teams
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<TeamDTO>> PostTeam(CreateTeamDTO team)
        {
            var newTeam = new Team () { Arena = team.arena, DateFounded = DateTime.UtcNow, Name = team.name, UserId = User.FindFirstValue(JwtRegisteredClaimNames.Sub)};
            _context.Teams.Add(newTeam);
            await _context.SaveChangesAsync();

            return Created($"/api/teams/{newTeam.TeamId}", team);
        }

        // DELETE: api/Teams/5
        [HttpDelete("{teamId}", Name = "DeleteTeam")]
        [Authorize(Roles = Roles.Admin)]
        public async Task<IActionResult> DeleteTeam(int teamId)
        {
            var team = await _context.Teams.FindAsync(teamId);
            if (team == null)
            {
                return NotFound();
            }

            _context.Teams.Remove(team);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TeamExists(int id)
        {
            return _context.Teams.Any(e => e.TeamId == id);
        }
    }
}
