namespace TeamCraft.Model
{
    public class Person
    {
        public Person() { }
        public int id { get; set; }
        public string name { get; set; }
        public string sureName { get; set; }

        public DateTime? databirthday { get; set; }
        public string gender { get; set; }

        public string login { get; set; }
        public string hashPassword { get; set; }

        public string? hobbiesPerson { get; set; }
        public string skillsPerson { get; set; }

        //public List<CategoryHobby> personHobbies { get; set; } = new();
        ////public int[] CategoryHobbyId { get; set; }
        ////public CategoryHobby[] hobbyUsers { get; set; }

        //public List<SkillPerson> skillsPersons { get; set; } = new();
        ////public int[] SkillPersonId { get; set; }
        //public SkillPerson[] skillsPerson { get; set; }

        public string urlContact { get; set; }
    }
}
