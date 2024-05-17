using TeamCraft.FilterLogic;
using TeamCraft.Model.UserAcrhitecture;

namespace TeamCraft.Model.TeamsArchitecture
{
    public class Team
    {
        public Team() { }

        public Team(string teamName, string? teamGoal, string? teamDescription)
        {
            this.teamName = teamName;
            this.teamGoal = teamGoal;
            this.teamDescription = teamDescription;
        }

        public int id { get; set; }

        public string teamName { get; set; }

        public string teamGoal { get; set; }

        public List<SkillPerson> team_stack { get; set; } = new();

        public string? teamDescription { get; set; }


        public List<MemberTeam>? memberTeam { get; set; } = new();

        public List<DataUser>? jion_means { get; set; } = new();

        public void AddPersonInTeam(MemberTeam user)
        {
            memberTeam.Add(user);
            user.dataMemberUser.inTeam = true;
        }
    }
}
