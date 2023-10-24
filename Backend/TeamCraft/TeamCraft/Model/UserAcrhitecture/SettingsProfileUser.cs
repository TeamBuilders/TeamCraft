namespace TeamCraft.Model.UserAcrhitecture
{
    public class SettingsProfileUser
    {
        public SettingsProfileUser() { }
        public SettingsProfileUser(string login, string hashPassword) 
        {
            this.login = login;
            this.hashPassword = hashPassword;
        }
        public SettingsProfileUser(string login, string hashPassword, bool isHade = false)
        {
            this.login = login;
            this.hashPassword = hashPassword;
            this.isHiddeInResearch = isHade;
        }
        public int id { get; set; }
        public string login { get; set; }
        public string hashPassword { get; set; }


        public bool isHiddeInResearch { get; set; } = false;
        public bool isHiddenData { get; set; }  = false;
    }
}
