namespace TeamCraft.FilterLogic
{
    public class CategoryHobby
    {
        public CategoryHobby() { }
        public CategoryHobby(string name)
        {
            this.nameHobby = name;
        }

        public CategoryHobby(int id, string name)
        {
            this.id = id;
            this.nameHobby = name;
        }
        public int id { get; set; }
        public string nameHobby { get; set; }

        public List<SkillPerson> skillPeople { get; set; }


    }
}
