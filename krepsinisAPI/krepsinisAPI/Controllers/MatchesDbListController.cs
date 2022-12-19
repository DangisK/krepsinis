﻿using System;
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
    [Route("api/matches")]
    [ApiController]
    public class MatchesDbListController : ControllerBase
    {
        private readonly BasketballDbContext _context;
        private readonly IAuthorizationService _authorizationService;
        private readonly UserManager<User> _userManager;

        public MatchesDbListController(BasketballDbContext context, UserManager<User> userManager, IAuthorizationService authorizationService)
        {
            _context = context;
            _userManager = userManager;
            _authorizationService = authorizationService;
        }

        // GET: api/Injuries
        [HttpGet]
        [Authorize(Roles = Roles.User)]
        public async Task<ActionResult<IEnumerable<Match>>> GetMatches()
        {
            var user = _userManager.Users.FirstOrDefault(user => user.Id == User.FindFirstValue(JwtRegisteredClaimNames.Sub));
            if (user.NormalizedUserName == "ADMIN") return await _context.Matches.ToListAsync();
            return NotFound();
        }
    }
}
