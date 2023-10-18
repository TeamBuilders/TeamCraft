using TeamCraft.Model.TeamsArchitecture;
using System.Text.Json.Serialization;

namespace TeamCraft.Model.UserAcrhitecture
{
    public class MemberTeam
    {
        public MemberTeam() { }
        public MemberTeam(DataUser dataMemberUser, string roleMember = null)
        {
            this.dataUserId = dataUserId;
            this.dataMemberUser = dataMemberUser;
            this.roleMember = roleMember;
        }

        public int Id { get; set; }
        public int dataUserId { get; set; }
        public DataUser dataMemberUser { get; set; }

        public string? roleMember { get; set; }

    }
}
