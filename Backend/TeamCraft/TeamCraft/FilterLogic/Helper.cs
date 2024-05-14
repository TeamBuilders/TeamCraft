using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TeamCraft.DataBaseController;
using TeamCraft.Model.UserAcrhitecture;

namespace TeamCraft.FilterLogic
{
    public static class Helper
    {

        public static int CalculateAgePerson(DateTime? birthDate)
        {
            DateTime currentDate = DateTime.Now;
            int age = currentDate.Year - birthDate.Value.Year;

            if (birthDate > currentDate.AddYears(-age))
            {
                age--;
            }

            return age;
        }


        static public string ComputeSHA512(string stringValue) // ДЕЛАЕТ В КАПСЕ, А НА САЙТАХ ХЭШКОД В НИЖНЕМ РЕГИСТРЕ
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


            if (password.Any(ch => !char.IsLetterOrDigit(ch)))
                hasSpecialChar = true;
            if (password.Length >= 8)
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

        static public bool CheckNumberInString(string value)
        {
            for(int i = 0; i < value.Length; i++) 
                if (value[i] > 47 && value[i] < 58)
                    return true;

            return false;
        } 

        static public AccountUser? FindUserFromClaim(IEnumerable<Claim> claim, DBConfigurator db)
        {
            if(claim.Count() > 0)
            {
                string loginUser = claim.ToArray()[0].Type;
                return db.accountsUser.Include(x => x.dataUser).Include(x => x.settingsUser).FirstOrDefault(item => item.settingsUser.login == loginUser);
            }

            return null;
        }
    }
}
