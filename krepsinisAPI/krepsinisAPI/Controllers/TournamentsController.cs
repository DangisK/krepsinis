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
using Microsoft.AspNetCore.Identity;
using krepsinisAPI.Auth.Model;
using Microsoft.AspNetCore.Authorization;
using System.Data;
using System.Security.Claims;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.Extensions.Hosting;

namespace krepsinisAPI.Controllers
{
    [Route("api/tournaments")]
    [ApiController]
    public class TournamentsController : ControllerBase
    {
        private readonly BasketballDbContext _context;
        private readonly IAuthorizationService _authorizationService;
        private readonly UserManager<User> _userManager;

        public TournamentsController(BasketballDbContext context, UserManager<User> userManager, IAuthorizationService authorizationService)
        {
            _context = context;
            _userManager = userManager;
            _authorizationService = authorizationService;
        }

        // GET: api/Tournaments
        [HttpGet]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<IEnumerable<TournamentDTO>>> GetTournaments()
        {
            var tournaments = await _context.Tournaments.ToListAsync();
            if (tournaments == null)
            {
                return NotFound();
            }

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));

            var adminDTOs = tournaments.Select(tournament => new TournamentDTO(tournament.TournamentId, tournament.Name, tournament.StartDate, tournament.EndDate,
                _userManager.Users.FirstOrDefault(user => user.Id == tournament.UserId)?.NormalizedUserName,
            _userManager.Users.FirstOrDefault(user => user.Id == tournament.UserId)?.Id)).ToList();
            if (user.NormalizedUserName == "ADMIN") return adminDTOs;

            var userDTOs = tournaments.Where((tournament) => tournament.UserId == user.Id).ToList().Select((tournament) => new TournamentDTO(tournament.TournamentId, tournament.Name, tournament.StartDate, tournament.EndDate, user.NormalizedUserName, user.Id)).ToList();
            return userDTOs;
        }

        // GET: api/Tournaments/5
        [HttpGet("{tournamentId}")]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<TournamentDTO>> GetTournament(int tournamentId)
        {
            var tournament = await _context.Tournaments.FindAsync(tournamentId);
            if (tournament == null)
            {
                return NotFound();
            }

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));

            var normalizedUsername = _userManager.Users.FirstOrDefault(user => user.Id == tournament.UserId)?.NormalizedUserName;
            var userId = _userManager.Users.FirstOrDefault(user => user.Id == tournament.UserId)?.Id;

            TournamentDTO tournamentDTO = new TournamentDTO(tournamentId, tournament.Name, tournament.StartDate, tournament.EndDate, normalizedUsername, userId);
            if (user.NormalizedUserName == "ADMIN") return tournamentDTO;

            if (user.Id != tournament.UserId) return NotFound();

            return Ok(tournamentDTO);
        }

        // PUT: api/Tournaments/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{tournamentId}")]
        [Authorize(Roles = Roles.User)]
        public async Task<IActionResult> PutTournament(int tournamentId, UpdateTournamentDTO updateTournamentDTO)
        {
            var tournament = await _context.Tournaments.FindAsync(tournamentId);
            if (tournament == null) return NotFound();

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));
            if (user.Id != tournament.UserId && user.NormalizedUserName != "ADMIN") return NotFound();

            tournament.Name = updateTournamentDTO.name;
            tournament.StartDate = updateTournamentDTO.startDate;
            tournament.EndDate = updateTournamentDTO.endDate;
            await _context.SaveChangesAsync();

            var normalizedUsername = _userManager.Users.FirstOrDefault(user => user.Id == tournament.UserId)?.NormalizedUserName;
            var userId = _userManager.Users.FirstOrDefault(user => user.Id == tournament.UserId)?.Id;

            return Ok(new TournamentDTO(tournamentId, updateTournamentDTO.name, tournament.StartDate, tournament.EndDate, normalizedUsername, userId));
        }

        // POST: api/Tournaments
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<TournamentDTO>> PostTournament(CreateTournamentDTO tournament)
        {
            var newTournament = new Tournament() { StartDate = tournament.startDate, EndDate = tournament.endDate, Name = tournament.name, UserId = User.FindFirstValue(JwtRegisteredClaimNames.Sub)};

            _context.Tournaments.Add(newTournament);
            await _context.SaveChangesAsync();

            var normalizedUsername = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub)).NormalizedUserName;
            if (normalizedUsername == null) return NotFound();

            var tournamentDTO = new TournamentDTO(newTournament.TournamentId, newTournament.Name, newTournament.StartDate, newTournament.EndDate, normalizedUsername, _userManager.Users.FirstOrDefault(user => user.Id == newTournament.UserId).Id);

            return Ok(tournamentDTO);
        }

        // DELETE: api/Tournaments/5
        [HttpDelete("{tournamentId}")]
        [Authorize(Roles = Roles.User)]
        public async Task<IActionResult> DeleteTournament(int tournamentId)
        {
            var tournament = await _context.Tournaments.FindAsync(tournamentId);
            if (tournament == null)
            {
                return NotFound();
            }

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));
            if (user.Id != tournament.UserId && user.NormalizedUserName != "ADMIN") return NotFound();

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
