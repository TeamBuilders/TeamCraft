namespace TeamCraft.Model
{
    public class AutorizationData
    {
        public string login { get; set; }
        public string password { get; set; }
        public AutorizationData(string login, string password)
        {
            this.login = login;
            this.password = password;
        }
        public AutorizationData()
        {

        }
    }
}
