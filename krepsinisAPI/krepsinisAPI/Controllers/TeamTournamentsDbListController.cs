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
    [Route("api/team-tournaments")]
    [ApiController]
    public class TeamTournamentsDbListController : ControllerBase
    {
        private readonly BasketballDbContext _context;

        public TeamTournamentsDbListController(BasketballDbContext context)
        {
            _context = context;
        }

        // GET: api/team-tournaments
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeamTournament>>> GetTournaments()
        {

            return await _context.TeamTournaments.ToListAsync();
        }
    }
}
