using TeamCraft.JsonParsersClasses;


namespace TeamCraft.Model.Posts
{
    public class HackathonPost
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Link { get; set; }
        public string Description { get; set; }
        public string? ImageBase64 { get; set; }
        //public List<PostsTags> PostTags { get; set; }
        public List<PostTag> PostTags { get; set; }

        public HackathonPost()
        {
            
        }

        
    }

}