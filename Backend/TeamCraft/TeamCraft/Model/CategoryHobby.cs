namespace TeamCraft.Model
{
    public class CategoryHobby
    {
        public CategoryHobby() { }
        public int id {  get; set; }
        public string nameHobby { get; set; }

        public List<SkillPerson> skillPeople { get; set; }

        //public int PersonId { get; set; }
        //public Person? person { get; set; }
    }
}
