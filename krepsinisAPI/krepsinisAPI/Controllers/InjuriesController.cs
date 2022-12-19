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
    [Route("api/players/{playerId}/injuries")]
    [ApiController]
    public class InjuriesController : ControllerBase
    {
        private readonly BasketballDbContext _context;
        private readonly IAuthorizationService _authorizationService;
        private readonly UserManager<User> _userManager;

        public InjuriesController(BasketballDbContext context, UserManager<User> userManager, IAuthorizationService authorizationService)
        {
            _context = context;
            _userManager = userManager;
            _authorizationService = authorizationService;
        }

        // GET: api/Injuries
        [HttpGet]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<IEnumerable<InjuryDTO>>> GetInjuries(int playerId)
        {
            var player = await _context.Players.FindAsync(playerId);
            if (player == null) return NotFound();

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));

            var injuries = await _context.Injuries.Where(injury => playerId == injury.PlayerId).ToListAsync();

            List<InjuryDTO> adminDTOs = new List<InjuryDTO>();
            for (int i = 0; i < injuries.Count; i++)
            {
                var injury = injuries[i];
                InjuryDTO injuryDTO = new InjuryDTO(injury.InjuryId, injury.Name, injury.InjuryDate, playerId,
                _userManager.Users.FirstOrDefault(user => user.Id == injury.UserId)?.NormalizedUserName,
                _userManager.Users.FirstOrDefault(user => user.Id == injury.UserId)?.Id);
                adminDTOs.Add(injuryDTO);
            }

            if (user.NormalizedUserName == "ADMIN") return Ok(adminDTOs);

            var userDTOs = adminDTOs.Where((dto) => dto.userId == user.Id);

            return Ok(userDTOs);
        }

        // GET: api/Injuries/5
        [HttpGet("{injuryId}")]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<InjuryDTO>> GetInjury(int playerId, int injuryId)
        {
            var player = await _context.Players.FindAsync(playerId);
            if (player == null) return NotFound();

            var injury = await _context.Injuries.FindAsync(injuryId);
            if (injury == null && injury?.PlayerId != playerId)
            {
                return NotFound();
            }

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));
            var normalizedUsername = _userManager.Users.FirstOrDefault(user => user.Id == injury.UserId)?.NormalizedUserName;
            var userId = _userManager.Users.FirstOrDefault(user => user.Id == injury.UserId)?.Id;

            InjuryDTO injuryDTO = new InjuryDTO(injury.InjuryId, injury.Name, injury.InjuryDate, playerId, normalizedUsername, userId);

            if (user.NormalizedUserName == "ADMIN") return injuryDTO;
            if (user.Id != injury.UserId) return NotFound();

            return Ok(injuryDTO);
        }

        // PUT: api/Injuries/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{injuryId}")]
        [Authorize(Roles = Roles.User)]
        public async Task<IActionResult> PutInjury(int playerId, int injuryId, UpdateInjuryDTO updateInjuryDTO)
        {
            var player = await _context.Players.FindAsync(playerId);
            if (player == null) return NotFound();

            var injury = await _context.Injuries.FindAsync(injuryId);
            if (injury == null) return NotFound();

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));
            if (user.Id != injury.UserId && user.NormalizedUserName != "ADMIN") return NotFound();

            injury.InjuryDate = updateInjuryDTO.injuryDate;
            injury.Name = updateInjuryDTO.name;

            await _context.SaveChangesAsync();

            var normalizedUsername = _userManager.Users.FirstOrDefault(user => user.Id == injury.UserId)?.NormalizedUserName;
            var userId = _userManager.Users.FirstOrDefault(user => user.Id == injury.UserId)?.Id;

            return Ok(new InjuryDTO(injury.InjuryId, injury.Name, injury.InjuryDate, playerId, normalizedUsername, userId));
        }

        // POST: api/Injuries
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<Injury>> PostInjury(CreateInjuryDTO injury, int playerId)
        {
            var player = await _context.Players.FindAsync(playerId);
            if (player == null) return NotFound();

            var newInjury = new Injury() { InjuryDate = injury.injuryDate, Name = injury.name, Player = player, UserId = User.FindFirstValue(JwtRegisteredClaimNames.Sub) } ;

            _context.Injuries.Add(newInjury);
            await _context.SaveChangesAsync();

            var normalizedUsername = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub)).NormalizedUserName;
            var userId = _userManager.Users.FirstOrDefault(user => user.Id == newInjury.UserId)?.Id;

            return Ok(new InjuryDTO(newInjury.InjuryId, injury.name, injury.injuryDate, playerId, normalizedUsername, userId));
        }

        // DELETE: api/Injuries/5
        [HttpDelete("{injuryId}")]
        [Authorize(Roles = Roles.User)]
        public async Task<IActionResult> DeleteInjury(int playerId, int injuryId)
        {
            var player = await _context.Players.FindAsync(playerId);
            if (player == null) return NotFound();

            var injury = await _context.Injuries.FindAsync(injuryId);
            if (injury == null)
            {
                return NotFound();
            }

            if (player.PlayerId != injury.PlayerId) return NotFound();

            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));
            if (user.Id != injury.UserId && user.NormalizedUserName != "ADMIN") return NotFound();

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
