using System.Text.Json.Serialization;


namespace TeamCraft.Model.Posts
{


    public class PostsTags
    {
        public int id { get; set; }
        public List<PostTag> PostTags { get; set; }
        public string nameTags { get; set; }
    }


    public class PostTag
    {
        public string nameTags { get; set; }
        public int HackathonPostId { get; set; }

        [JsonIgnore]
        public HackathonPost HackathonPost { get; set; }
        public int PostsTagsId { get; set; }
        public PostsTags PostsTags { get; set; }
    }

}