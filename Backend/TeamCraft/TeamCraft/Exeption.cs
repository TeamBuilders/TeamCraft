namespace TeamCraft
{
    public class CustomErrorException : Exception
    {
        public int ErrorCode { get; }

        public CustomErrorException(int errorCode, string message)
            : base(message)
        {
            ErrorCode = errorCode;
        }

    }

}
