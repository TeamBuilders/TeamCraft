namespace TeamCraft.Model
{
    public class SkillPerson
    {
        public SkillPerson() { }
        public int id { get; set; }
        public string nameSkill { get; set; }

        public int? CategoryHobbyId { get; set; }
        public CategoryHobby? isCategoryHobby { get; set; }  
    }
}
