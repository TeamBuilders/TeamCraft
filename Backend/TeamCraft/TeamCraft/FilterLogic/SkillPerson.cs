using System.Text.Json.Serialization;

namespace TeamCraft.FilterLogic
{
    public class SkillPerson
    {
        public SkillPerson()
        {

        }

        public SkillPerson(string name,  CategoryHobby hobbyAttachment)
        {
            this.nameSkill = name;
            this.categoryHobby = hobbyAttachment;
        }


        public int id { get; set; }
        public string nameSkill { get; set; }
        public int? categoryHobbyId { get; set; }
        [JsonIgnore]
        [Newtonsoft.Json.JsonIgnore]
        public CategoryHobby? categoryHobby { get; set; }

        //public int? CategoryHobbyId { get; set; }
        //public CategoryHobby? CategoryHobby { get; set; }

    }
}
