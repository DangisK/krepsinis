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
    [Route("api/tournaments/{tournamentId}/matches")]
    [ApiController]
    public class MatchesController : ControllerBase
    {
        private readonly BasketballDbContext _context;
        private readonly IAuthorizationService _authorizationService;
        private readonly UserManager<User> _userManager;

        public MatchesController(BasketballDbContext context, UserManager<User> userManager, IAuthorizationService authorizationService)
        {
            _context = context;
            _userManager = userManager;
            _authorizationService = authorizationService;
        }


        // GET: api/Matches
        [HttpGet]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<IEnumerable<MatchDTO>>> GetMatches(int tournamentId)
        {
            var tournament = await _context.Tournaments.FindAsync(tournamentId);
            if (tournament == null) return NotFound();

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));

            var matches = await _context.Matches.Where(match => tournamentId == match.TournamentId).ToListAsync();

            List<MatchDTO> adminDTOs = new List<MatchDTO>();
            for (int i = 0; i < matches.Count; i++)
            {
                var match = matches[i];
                var homeTeam = await _context.Teams.FindAsync(matches[i].HomeTeamId);
                var awayTeam = await _context.Teams.FindAsync(matches[i].AwayTeamId);
                MatchDTO matchDTO = new MatchDTO(match.MatchId, match.HomeTeamScore, match.AwayTeamScore, tournamentId, match.MatchDate, match.HomeTeamId, match.AwayTeamId, homeTeam.Name, awayTeam.Name, homeTeam.Arena,
                _userManager.Users.FirstOrDefault(user => user.Id == match.UserId)?.NormalizedUserName,
                _userManager.Users.FirstOrDefault(user => user.Id == match.UserId)?.Id);
                adminDTOs.Add(matchDTO);
            }
            if (user.NormalizedUserName == "ADMIN") return Ok(adminDTOs);

            var userDTOs = adminDTOs.Where((dto) => dto.userId == user.Id);

            return Ok(userDTOs);
        }

        // GET: api/Matches/5
        [HttpGet("{matchId}")]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<MatchDTO>> GetMatch(int tournamentId, int matchId)
        {
            var tournament = await _context.Tournaments.FindAsync(tournamentId);
            if (tournament == null) return NotFound();

            var match = await _context.Matches.FindAsync(matchId);
            if (match == null) return NotFound();

            if (match.TournamentId != tournamentId) return NotFound();

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));
            var normalizedUsername = _userManager.Users.FirstOrDefault(user => user.Id == match.UserId)?.NormalizedUserName;
            var userId = _userManager.Users.FirstOrDefault(user => user.Id == match.UserId)?.Id;

            var homeTeam = await _context.Teams.FindAsync(match.HomeTeamId);
            var awayTeam = await _context.Teams.FindAsync(match.AwayTeamId);

            MatchDTO matchDTO = new MatchDTO(matchId, match.HomeTeamScore, match.AwayTeamScore, tournamentId, match.MatchDate, match.HomeTeamId, match.AwayTeamId,
                homeTeam.Name, awayTeam.Name, homeTeam.Arena, normalizedUsername, userId);

            if (user.NormalizedUserName == "ADMIN") return matchDTO;
            if (user.Id != tournament.UserId) return NotFound();

            return Ok(matchDTO);
        }

        // PUT: api/Matches/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{matchId}")]
        [Authorize(Roles = Roles.User)]
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

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));
            if (user.Id != tournament.UserId && user.NormalizedUserName != "ADMIN") return NotFound();

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

            var normalizedUsername = _userManager.Users.FirstOrDefault(user => user.Id == match.UserId)?.NormalizedUserName;
            var userId = _userManager.Users.FirstOrDefault(user => user.Id == match.UserId)?.Id;

            return Ok(new MatchDTO(match.MatchId, match.HomeTeamScore, match.AwayTeamScore, tournamentId, updateMatchDTO.matchDate, match.HomeTeamId, match.AwayTeamId, home, away, arena, normalizedUsername, userId));
        }

        // POST: api/Matches
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<Match>> PostMatch(int tournamentId, CreateMatchDTO match)
        {
            var homeTeam = await _context.Teams.FindAsync(match.firstTeamId);
            if (homeTeam == null) return NotFound("Home team not found");
            var awayTeam = await _context.Teams.FindAsync(match.secondTeamId);
            if (awayTeam == null) return NotFound("Away team not found");
            var tournament = await _context.Tournaments.FindAsync(tournamentId);
            if (tournament == null) return NotFound("Tournament team not found");
            if (match.firstTeamId == match.secondTeamId) return NotFound("Matching first and second team IDs");

            var newMatch = new Match () { AwayTeamScore = match.awayTeamScore, HomeTeamScore = match.homeTeamScore, MatchDate = match.matchDate, TournamentId = tournamentId, Tournament = tournament, HomeTeam = homeTeam, AwayTeam = awayTeam, AwayTeamId = awayTeam.TeamId, HomeTeamId = homeTeam.TeamId, UserId = User.FindFirstValue(JwtRegisteredClaimNames.Sub) };
            _context.Matches.Add(newMatch);
            await _context.SaveChangesAsync();

            var normalizedUsername = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub)).NormalizedUserName;
            var userId = _userManager.Users.FirstOrDefault(user => user.Id == newMatch.UserId)?.Id;

            MatchDTO matchDTO = new MatchDTO(newMatch.MatchId, newMatch.HomeTeamScore, newMatch.AwayTeamScore, newMatch.TournamentId, newMatch.MatchDate, newMatch.HomeTeamId, newMatch.AwayTeamId, newMatch.HomeTeam.Name, newMatch.AwayTeam.Name, newMatch.HomeTeam.Arena, normalizedUsername, userId);

            return Ok(matchDTO);
        }

        // DELETE: api/Matches/5
        [HttpDelete("{matchId}")]
        [Authorize(Roles = Roles.User)]
        public async Task<IActionResult> DeleteMatch(int tournamentId, int matchId)
        {
            var tournament = await _context.Tournaments.FindAsync(tournamentId);
            if (tournament == null) return NotFound();

            var match = await _context.Matches.FindAsync(matchId);
            if (match == null)
            {
                return NotFound();
            }

            if (tournament.TournamentId != match.TournamentId) return NotFound();

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));
            if (user.Id != match.UserId && user.NormalizedUserName != "ADMIN") return NotFound();

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
