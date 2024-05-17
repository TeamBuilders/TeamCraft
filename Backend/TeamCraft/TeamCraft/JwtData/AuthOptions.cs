using Microsoft.IdentityModel.Tokens;
using System.Text;

public class AuthOptions
{
    public const string ISSUER = "MyAuthServer";
    public const string AUDIENCE = "MyAuthClient";
    static string KEY = File.ReadAllText("key.txt");


    public static SymmetricSecurityKey GetSymmetricSecurityKey() =>
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(KEY));
}

