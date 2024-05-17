using System.Text.Json.Serialization;

namespace TeamCraft.FilterLogic
{
    public class SkillPerson
    {
        public SkillPerson()
        {

        }

        public SkillPerson(string name, CategoryHobby hobbyAttachment)
        {
            this.nameSkill = name;
            this.categoryHobby = hobbyAttachment;
        }
        public SkillPerson(int id, string name, CategoryHobby hobbyAttachment, int hobbyid)
        {
            this.id = id;
            this.nameSkill = name;
            this.categoryHobbyId = hobbyid;
        }

        public int id { get; set; }
        public string nameSkill { get; set; }
        public int? categoryHobbyId { get; set; }
        [JsonIgnore]
        [Newtonsoft.Json.JsonIgnore]
        public CategoryHobby? categoryHobby { get; set; }



        public override bool Equals(object? obj)
        {
            if (obj is SkillPerson person) return nameSkill == person.nameSkill;
            return false;
        }

    }
}
