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
using Microsoft.AspNetCore.Identity;

namespace krepsinisAPI.Controllers
{
    [Route("api/teams")]
    [ApiController]
    public class TeamsController : ControllerBase
    {
        private readonly BasketballDbContext _context;
        private readonly IAuthorizationService _authorizationService;
        private readonly UserManager<User> _userManager;

        public TeamsController(BasketballDbContext context, UserManager<User> userManager, IAuthorizationService authorizationService)
        {
            _context = context;
            _userManager = userManager;
            _authorizationService = authorizationService;
        }

        // GET: api/Teams
        [HttpGet]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<IEnumerable<TeamDTO>>> GetTeams()
        {
            var teams = await _context.Teams.ToListAsync();
            if (teams == null)
            {
                return NotFound();
            }

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));

            var adminDTOs = teams.Select(team => new TeamDTO(team.TeamId, team.Name, team.Arena, team.DateFounded,
                _userManager.Users.FirstOrDefault(user => user.Id == team.UserId)?.NormalizedUserName,
            _userManager.Users.FirstOrDefault(user => user.Id == team.UserId)?.Id)).ToList();
            if (user.NormalizedUserName == "ADMIN") return adminDTOs;

            var userDTOs = teams.Where((team) => team.UserId == user.Id).ToList().Select((team) => new TeamDTO(team.TeamId, team.Name, team.Arena, team.DateFounded, user.NormalizedUserName, user.Id)).ToList();
            return Ok(userDTOs);
        }

        // GET: api/Teams/5
        [HttpGet("{teamId}")]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<TeamDTO>> GetTeam(int teamId)
        {
            var team = await _context.Teams.FindAsync(teamId);
            if (team == null)
            {
                return NotFound();
            }

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));
            var normalizedUsername = _userManager.Users.FirstOrDefault(user => user.Id == team.UserId)?.NormalizedUserName;
            var userId = _userManager.Users.FirstOrDefault(user => user.Id == team.UserId)?.Id;

            var teamDTO = new TeamDTO(team.TeamId, team.Name, team.Arena, dateFounded: DateTime.UtcNow, normalizedUsername, userId);
            if (user.NormalizedUserName == "ADMIN") return teamDTO;

            if (user.Id != team.UserId) return NotFound();

            return Ok(teamDTO);
        }

        // PUT: api/Teams/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{teamId}")]
        [Authorize(Roles = Roles.User)]
        public async Task<IActionResult> PutTeam(int teamId, UpdateTeamDTO teamDTO)
        {
            var contextTeam = await _context.Teams.FindAsync(teamId);
            if (contextTeam == null) return NotFound();

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));
            if (user.Id != contextTeam.UserId && user.NormalizedUserName != "ADMIN") return NotFound();

            contextTeam.Arena = teamDTO.arena;
            contextTeam.Name = teamDTO.name;
            contextTeam.DateFounded = teamDTO.dateFounded;
            await _context.SaveChangesAsync();

            var normalizedUsername = _userManager.Users.FirstOrDefault(user => user.Id == contextTeam.UserId)?.NormalizedUserName;
            var userId = _userManager.Users.FirstOrDefault(user => user.Id == contextTeam.UserId)?.Id;

            return Ok(new TeamDTO(teamId, contextTeam.Name, contextTeam.Arena, contextTeam.DateFounded, normalizedUsername, userId));
        }

        // POST: api/Teams
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<TeamDTO>> PostTeam(CreateTeamDTO team)
        {
            var newTeam = new Team() { Arena = team.arena, DateFounded = team.dateFounded, Name = team.name, UserId = User.FindFirstValue(JwtRegisteredClaimNames.Sub) };

            _context.Teams.Add(newTeam);
            await _context.SaveChangesAsync();

            var normalizedUsername = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub)).NormalizedUserName;
            var userId = _userManager.Users.FirstOrDefault(user => user.Id == newTeam.UserId)?.Id;

            var teamDTO = new TeamDTO(newTeam.TeamId, team.name, team.arena, team.dateFounded, normalizedUsername, userId);

            return Ok(teamDTO);
        }

        // DELETE: api/Teams/5
        [HttpDelete("{teamId}", Name = "DeleteTeam")]
        [Authorize(Roles = Roles.User)]
        public async Task<IActionResult> DeleteTeam(int teamId)
        {
            var team = await _context.Teams.FindAsync(teamId);
            if (team == null)
            {
                return NotFound();
            }

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));
            if (user.Id != team.UserId && user.NormalizedUserName != "ADMIN") return NotFound();

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
