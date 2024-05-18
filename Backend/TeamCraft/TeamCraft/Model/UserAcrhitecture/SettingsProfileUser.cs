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
            this.email = form.email;
        }


        public int id { get; set; }
        public string login { get; set; }

        public string? email { get; set; }

        public int rest { get; set; }

        [Newtonsoft.Json.JsonIgnore]
        [System.Text.Json.Serialization.JsonIgnore]
        public string hashPassword { get; set; }


        public bool isHiddeInResearch { get; set; } = false;
        public bool isHiddenData { get; set; } = false;
    }
}
