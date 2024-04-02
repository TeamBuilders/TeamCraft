using TeamCraft.Model.TeamsArchitecture;
using System.Text.Json.Serialization;

namespace TeamCraft.Model.UserAcrhitecture
{
    public class MemberTeam
    {
        public MemberTeam() { }
        public MemberTeam(DataUser dataMemberUser, string roleMember = null)
        {
            this.dataMemberUser = dataMemberUser;
            this.roleMember = roleMember;
        }

        public int Id { get; set; }
        public DataUser dataMemberUser { get; set; }

        public string? roleMember { get; set; }

    }
}
