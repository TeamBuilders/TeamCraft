using TeamCraft.FilterLogic;
using TeamCraft.JsonParsersClasses;

namespace TeamCraft.Model.UserAcrhitecture
{
    public class SettingsProfileUser
    {
        public SettingsProfileUser() { }
        public SettingsProfileUser(RegistrationForm form)
        {
            this.login = form.login;
            this.hashPassword = Helper.ComputeSHA512(form.password);
        }

        //public SettingsProfileUser(string login, string password, bool isHade = false)
        //{
        //    this.login = login;
        //    this.hashPassword = Helper.ComputeSHA512(password);
        //    this.isHiddeInResearch = isHade;
        //}
        public int id { get; set; }
        public string login { get; set; }
        public string hashPassword { get; set; }


        public bool isHiddeInResearch { get; set; } = false;
        public bool isHiddenData { get; set; }  = false;
    }
}
