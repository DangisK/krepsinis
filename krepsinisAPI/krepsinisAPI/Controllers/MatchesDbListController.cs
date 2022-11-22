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
    [Route("api/matches")]
    [ApiController]
    public class MatchesDbListController : ControllerBase
    {
        private readonly BasketballDbContext _context;

        public MatchesDbListController(BasketballDbContext context)
        {
            _context = context;
        }

        // GET: api/Injuries
        [HttpGet]
        [ResponseCache(Duration = 60)]
        public async Task<ActionResult<IEnumerable<Match>>> GetMatches()
        {

            return await _context.Matches.ToListAsync();
        }
    }
}
