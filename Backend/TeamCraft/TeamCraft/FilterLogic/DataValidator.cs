using TeamCraft.Model;
using TeamCraft.JsonParsersClasses;
using TeamCraft.DataBaseController;
using TeamCraft.Model.UserAcrhitecture;
using Microsoft.EntityFrameworkCore;
namespace TeamCraft.FilterLogic
{
    public static class DataValidator
    {
        private static string specSymbols = "!@#$%^&?*()\\/:;'[]{},.\"`~";
        private static string numbers = "1234567890";
        static public RequestStatus CheckCorrectUserData(RegistrationForm? unverifiedUser, DBConfigurator db)
        {
            var result = new RequestStatus();

            if(unverifiedUser == null) 
            {
                result.SetBadStatus();
                result.message.Add("User = null");
                return result;
            }
            if(unverifiedUser.gender == null || unverifiedUser.sureName == null || unverifiedUser.name == null ||
                unverifiedUser.birthday == null || unverifiedUser.contact == null || unverifiedUser.login == null
                || unverifiedUser.password == null) 
            {
                
                result.SetBadStatus();
                result.message.Add("Not all required fields are filled in!");
                return result;
            }
            if (!unverifiedUser.login.All(symbols => !specSymbols.Contains(symbols)) || unverifiedUser.login.Length < 6 || unverifiedUser.login.Length > 16)
            {
                result.message.Add("Inccorect login user. Size or have special symbols");
            }
            if(!Helper.CheckPasswordRequest(unverifiedUser.password))
            {
                result.message.Add("Inccorect password: length, no number or special symbols");
            }
            if (!unverifiedUser.name.All(symbols => !specSymbols.Contains(symbols)) || !unverifiedUser.name.All(symbols => !numbers.Contains(symbols)) || unverifiedUser.name.Length < 2 || unverifiedUser.name.Length > 16)
            {
                result.message.Add("Inccorect name user. Size or have special symbols or numbers");
            }
            if (!unverifiedUser.sureName.All(symbols => !specSymbols.Contains(symbols)) || !unverifiedUser.sureName.All(symbols => !numbers.Contains(symbols)) || unverifiedUser.sureName.Length < 2 || unverifiedUser.sureName.Length > 16)
            {
                result.message.Add("Inccorect surname user. Size or have special symbols or numbers");
            }
            if(Helper.CalculateAgePerson(unverifiedUser.birthday) > 99 || Helper.CalculateAgePerson(unverifiedUser.birthday) < 12)
            {
                result.message.Add("Юзер либо еще не родился, либо уже умер, в любом случае все по новой");
            }
            if (db.settingsProfileUser.FirstOrDefault(users => users.login == unverifiedUser.login) != null) 
            {
                result.message.Add("Такой логин уже есть");
            }
            if (result.message.Count > 0) 
            {
                result.SetBadStatus();
            }

            return result;
        }
        static public RequestStatus CheckCorrectLoginData(LoginForm? loginForm, DBConfigurator db)
        {
            RequestStatus result = new RequestStatus();
            if (loginForm == null || loginForm.login == null || loginForm.password == null) 
            {
                result.SetBadStatus();
                result.message.Add("loginForm = null or Not all required fields are filled in!");
                return result;
            }
            string pass = Helper.ComputeSHA512(loginForm.password);
            var users = db.accountsUser.Include(item => item.dataUser).Include(item => item.settingsUser).ToList();
            AccountUser? account = db.accountsUser.Include(item => item.dataUser).Include(item => item.settingsUser).FirstOrDefault(users => users.settingsUser.hashPassword == Helper.ComputeSHA512(loginForm.password));
            if (account == null || account.settingsUser.login != loginForm.login) 
            {
                result.SetBadStatus();
                result.message.Add("Inccorect password or login");
                return result;
            }
            result.message.Add("Correct data");
            return result;
        }
    }
}
