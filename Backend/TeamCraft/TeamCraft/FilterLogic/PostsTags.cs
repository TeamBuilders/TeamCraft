using TeamCraft.Model.Posts;

namespace TeamCraft.FilterLogic
{
    /*public class PostsTags
    {
        public PostsTags() { }
        public PostsTags(string name)
        {
            this.nameTags = name;
        }
        public int id { get; set; }
        public string nameTags { get; set; }

        //public List<SkillPerson> skillPeople { get; set; }

        public PostsTags(int id, string name)
        {
            this.id = id;
            this.nameTags = name;
        }
    }*/

    public class PostsTags
    {
        public int id { get; set; }
        public string nameTags { get; set; }
        public List<PostTag> PostTags { get; set; } 
    }

    public class PostTag // Новый класс для связи "многие ко многим"
    {
        public string nameTags { get; set; } 
        public int HackathonPostId { get; set; }
        public HackathonPost HackathonPost { get; set; }
        public int PostsTagsId { get; set; }
        public PostsTags PostsTags { get; set; }
    }
}