namespace TeamCraft.Model
{
    public class Team
    {
        public Team() { }

        public int Id { get; set; }

        public string teamName { get; set; }

        public string? teamGoal { get; set; }

        public string? teamDescription { get; set; }

        public List<Person> people { get; set; }



        

    }
}
