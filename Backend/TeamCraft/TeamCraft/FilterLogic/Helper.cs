namespace TeamCraft.FilterLogic
{
    public static class Helper
    {
        static public int CalculateAgePerson(DateTime dataBirthday)
        {
            var  substract = dataBirthday - DateTime.Now;
            return (new DateTime(1970, 1, 1, 0, 0, 0, 0)).AddSeconds(substract.TotalSeconds).Year;
        }

        internal static void CalculateAgePerson(DateTime? databirthday)
        {
            throw new NotImplementedException();
        }
    }
}
