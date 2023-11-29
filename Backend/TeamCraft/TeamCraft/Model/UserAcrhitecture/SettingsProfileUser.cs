using TeamCraft.FilterLogic;

namespace TeamCraft.Model.UserAcrhitecture
{
    public class SettingsProfileUser
    {
        public SettingsProfileUser() { }

        public SettingsProfileUser(string login, string password, bool isHade = false)
        {
            this.login = login;
            this.hashPassword = Helper.ComputeSHA512(hashPassword);
            this.isHiddeInResearch = isHade;
        }
        public int id { get; set; }
        public string login { get; set; }
        public string hashPassword { get; set; }


        public bool isHiddeInResearch { get; set; } = false;
        public bool isHiddenData { get; set; }  = false;
    }
}
