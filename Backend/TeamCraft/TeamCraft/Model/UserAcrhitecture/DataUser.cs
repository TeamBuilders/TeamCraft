using TeamCraft.FilterLogic;

namespace TeamCraft.Model.UserAcrhitecture
{
    public class DataUser
    {
        public DataUser() { }
        public DataUser(string name, string surname, string description, DateTime birthdayUser, string urlContact, List<SkillPerson> skillsPerson)
        {
            this.name = name;
            this.sureName = surname;
            this.descriptionUser = description;
            this.databirthday = birthdayUser;
            this.urlContact = urlContact;
            this.skillsPerson = skillsPerson;
            this.age = Helper.CalculateAgePerson(birthdayUser);
            this.inTeam = false;
        }
        public int Id { get; set; }
        public string name { get; set; }
        public string sureName { get; set; }

        public string descriptionUser { get; set; }
        public DateTime databirthday { get; set; }
        public string? gender { get; set; }

        public int age { get; set; }


        public List<CategoryHobby> hobbiesPerson { get; set; }
        public List<SkillPerson> skillsPerson { get; set; }
        public string? goalsPerson { get; set; }
        public string urlContact { get; set; }
        public bool inTeam { get; set; }
    }
}
