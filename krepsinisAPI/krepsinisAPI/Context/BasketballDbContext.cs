using krepsinisAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace krepsinisAPI.Context
{
    public class BasketballDbContext : DbContext
    {
        public DbSet<Injury> Injuries { get; set; }
        public DbSet<Match> Matches { get; set; }
        public DbSet<Player> Players { get; set; }
        public DbSet<Team> Teams { get; set; }
        public DbSet<TeamTournament> TeamTournaments { get; set; }
        public DbSet<Tournament> Tournaments { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlServer("Data Source=(localdb)\\MSSQLLocalDB; Initial Catalog=Basketball");
        }
    }
}
