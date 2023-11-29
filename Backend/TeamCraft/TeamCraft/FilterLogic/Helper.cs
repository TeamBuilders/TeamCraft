using System.Security.Cryptography;
using System.Text;

namespace TeamCraft.FilterLogic
{
    public static class Helper
    {
        static public int CalculateAgePerson(DateTime dataBirthday)
        {
            var  substract = dataBirthday - DateTime.Now;
            return (new DateTime(1970, 1, 1, 0, 0, 0, 0)).AddSeconds(substract.TotalSeconds).Year;
        }

        static public string ComputeSHA512(string stringValue)
        {
            StringBuilder sb = new StringBuilder();
            using (SHA512 sha512 = SHA512.Create())
            {
                byte[] hashValue = sha512.ComputeHash(Encoding.UTF8.GetBytes(stringValue));
                foreach (byte b in hashValue)
                {
                    sb.Append($"{b:X2}");
                }
            }

            return sb.ToString();
        }

        static public bool CheckPasswordRequest(string password) 
        {
            bool sizePassword = false,
                 hasUpChar = false,
                 hasDownChar = false,
                 hasNumber = CheckNumberInString(password),
                 hasSpecialChar = false;

            if(password.Length >= 8)
                sizePassword = true;
            if(password.ToUpper() != password)
                hasDownChar= true;
            if(password.ToLower() != password)
                hasUpChar= true;



            return sizePassword && hasUpChar && hasDownChar && hasNumber && hasSpecialChar;
        }

        static public bool CheckCorrectPassword(string enterPassword, string hashCode)
        {
            return hashCode == ComputeSHA512(enterPassword);
        }

        static private bool CheckNumberInString(string value)
        {
            for(int i = 0; i < value.Length; i++) 
                if (value[i] > 47 && value[i] < 58)
                    return true;

            return false;
        }
    }
}
