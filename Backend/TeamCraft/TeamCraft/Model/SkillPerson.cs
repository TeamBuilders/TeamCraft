namespace TeamCraft.Model
{
    public class SkillPerson
    {
        public SkillPerson(string NameSkill) 
        {

        }
        public int id { get; set; }
        public string nameSkill { get; set; }

        public int? CategoryHobbyId { get; set; }
        public CategoryHobby? isCategoryHobby { get; set; }

        //public int PersonId { get; set; }
        //public Person? person { get; set; }
    }
}
