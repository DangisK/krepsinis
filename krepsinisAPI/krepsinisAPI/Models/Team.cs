namespace krepsinisAPI.Models
{
    public class Team
    {
        public int TeamId { get; set; }
        public string? Name { get; set; }
        public string? Arena { get; set; }

        public DateTime DateFounded { get; set; }
        //public List<Player>? Players { get; set; }
    }
}
