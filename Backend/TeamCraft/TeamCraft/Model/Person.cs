namespace TeamCraft.Model
{
    public class Person
    {
        public Person() { }
        public int Id { get; set; }
        public string nickName { get; set; }

        public DateTime databirthday { get; set; }
        public string gender { get; set; }



        public List<CategoryHobby> personHobbies { get; set; } = new();
        //public int[] CategoryHobbyId { get; set; }
        //public CategoryHobby[] hobbyUsers { get; set; }

        public List<SkillPerson> skillsPersons { get; set; }
        //public int[] SkillPersonId { get; set; }
        //public SkillPerson[] skillsPerson { get; set; }

        public string urlContact { get; set; }
    }
}
