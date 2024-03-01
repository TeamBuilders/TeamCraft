using TeamCraft.FilterLogic;
using TeamCraft.JsonParsersClasses;

namespace TeamCraft.Model.UserAcrhitecture
{
    public class DataUser
    {
        public DataUser() { }
        //public DataUser(string name, string surname, string description, DateTime birthdayUser,string urlContact)
        //{
        //    this.name = name;
        //    this.sureName = surname;
        //    this.descriptionUser = description;
        //    this.databirthday = birthdayUser;
        //    this.urlContact = urlContact;
        //    this.inTeam = false;
        //}
        public DataUser(RegistrationForm form)
        {
            this.name = form.name;
            this.sureName = form.sureName;
            this.descriptionUser = form.description;
            this.gender = form.gender;
            this.databirthday = form.birthday;
            this.urlContact = form.contact;
        }
        public int Id { get; set; }
        public string name { get; set; }
        public string sureName { get; set; }

        public string? descriptionUser { get; set; }
        public DateTime? databirthday { get; set; }
        public string? gender { get; set; }
        

        public List<CategoryHobby> hobbiesPerson { get; set; }
        public List<SkillPerson> skillsPerson { get; set; }
        public string? goalsPerson { get; set; }
        public string urlContact { get; set; }
        public bool inTeam { get; set; } = false;
    }
}
