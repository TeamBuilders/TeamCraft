using TeamCraft.DataBaseController;
using TeamCraft.Model.UserAcrhitecture;
using System.Text.Json.Serialization;
using TeamCraft.FilterLogic;

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

        public int Id { get; set; }

        public string teamName { get; set; }

        public string teamGoal { get; set; }

        public List<SkillPerson> team_stack { get; set; } = new();

        public string? teamDescription { get; set; }


        public List<MemberTeam>? MemberTeam { get; set; } = new();

        public List<DataUser>? Jion_means { get; set; } = new();

        public void AddPersonInTeam(MemberTeam user)
        {
            MemberTeam.Add(user);
            user.dataMemberUser.inTeam = true;
        }
    }
}
