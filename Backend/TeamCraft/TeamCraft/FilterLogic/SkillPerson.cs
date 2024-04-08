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
        public string field1 { get; set; }
        public string field2 { get; set; }
        public string field3 { get; set; }
        public string field4 { get; set; }
        public string field5 { get; set; }
        public string field6 { get; set; }
        public string field7 { get; set; }
        public string field8 { get; set; }

        //public int? CategoryHobbyId { get; set; }
        //public CategoryHobby? CategoryHobby { get; set; }

    }

    public class SkillPersonGameDev: SkillPerson
    {
        public SkillPersonGameDev()
        {

        }

        public SkillPersonGameDev(string name, CategoryHobby hobbyAttachment)
        {
            this.nameSkill = name;
            this.categoryHobby = hobbyAttachment;
        }

        public new string gamedev
        {
            get { return base.field1; }
            set { base.field1 = value; }
        }
    }



}
