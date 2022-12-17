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
    [Route("api/injuries")]
    [ApiController]
    public class InjuriesDbListController : ControllerBase
    {
        private readonly BasketballDbContext _context;

        public InjuriesDbListController(BasketballDbContext context)
        {
            _context = context;
        }

        // GET: api/Injuries
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Injury>>> GetInjuries()
        {

            return await _context.Injuries.ToListAsync();
        }
    }
}
