namespace TeamCraft.Model
{
    public class EmailData
    {
        public EmailData() { }
        public EmailData(string mail) 
        {
            this.email = mail;
        }

        public string email { get; set; }
    }
}
