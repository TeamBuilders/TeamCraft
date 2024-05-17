namespace TeamCraft.Model.Posts
{
    public class HackathonPost
    {
        public int id { get; set; }
        public string Title { get; set; }
        public string Link { get; set; }
        public string Description { get; set; }

        public string? ImageUrl { get; set; }

        //public List<PostsTags> PostTags { get; set; }
        public List<PostTag> PostTags { get; set; }

        public HackathonPost()
        {

        }

        //[JsonIgnore]
        [Newtonsoft.Json.JsonIgnore]
        [System.Text.Json.Serialization.JsonIgnore]
        public string? ImageBase64 { get; set; }

    }

}