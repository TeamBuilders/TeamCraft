namespace TeamCraft.JwtData
{
    public class EmailData
    {
        public EmailData() { }
        public EmailData(string mail)
        {
            email = mail;
        }
        public int Id { get; set; }
        public string? email { get; set; }
        public int? code { get; set; }
    }
}
