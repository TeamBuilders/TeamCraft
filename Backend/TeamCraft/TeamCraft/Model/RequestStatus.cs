namespace TeamCraft.Model
{
    public class RequestStatus
    {
        public RequestStatus()
        {
            this.statusCode = 200;
            this.statusRequest = "Ok";
            message = new List<string> { };
        }
        //public RequestStatus(List<string> message,int numCode = 200, string status = "OK")
        //{
        //    this.statusCode = numCode;
        //    this.message = message;
        //    this.statusRequest = status;
        //}

        public void SetBadStatus()
        {
            statusCode = 400;
            this.statusRequest = "error";
        }

        public int statusCode;
        public string statusRequest;
        public List<string> message;
    }
}
