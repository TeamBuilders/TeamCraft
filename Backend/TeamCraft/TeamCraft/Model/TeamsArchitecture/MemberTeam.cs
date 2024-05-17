using System.Text.Json.Serialization;
using TeamCraft.Model.UserAcrhitecture;

namespace TeamCraft.Model.TeamsArchitecture
{
    public class MemberTeam
    {
        public MemberTeam() { }
        public MemberTeam(DataUser dataMemberUser, Team team, TypeRoleMember roleMember = TypeRoleMember.participant)
        {
            this.dataMemberUser = dataMemberUser;
            this.roleMember = roleMember;
            this.team = team;
        }

        public int id { get; set; }
        public int dataMemberUserId { get; set; }
        public DataUser dataMemberUser { get; set; }

        public int teamId { get; set; }
        [JsonIgnore]
        [Newtonsoft.Json.JsonIgnore]
        public Team team { get; set; }

        public TypeRoleMember roleMember { get; set; }

    }
}
