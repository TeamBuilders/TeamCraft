namespace TeamCraft
{
    public class CustomErrorException : Exception
    {
        public int ErrorCode { get; }//номер ошибки

        public CustomErrorException(int errorCode, string message)
            : base(message)
        {
            ErrorCode = errorCode;
        }
        
    }

}
