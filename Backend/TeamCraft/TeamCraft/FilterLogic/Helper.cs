namespace TeamCraft.FilterLogic
{
    /*public static class Helper
    {
        static public int CalculateAgePerson(DateTime dataBirthday)
        {
            var  substract = dataBirthday - DateTime.Now;
            return (new DateTime(1970, 1, 1, 0, 0, 0, 0)).AddSeconds(substract.TotalSeconds).Year;
        }
    }*/

    public static class Helper
    {
        public static int CalculateAgePerson(DateTime birthDate)
        {
            DateTime currentDate = DateTime.Now;
            int age = currentDate.Year - birthDate.Year;

            if (birthDate > currentDate.AddYears(-age))
            {
                age--;
            }

            return age;
        }
    }

}   
