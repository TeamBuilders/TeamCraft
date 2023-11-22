using Microsoft.EntityFrameworkCore;
using TeamCraft.DataBaseController;
using TeamCraft.Model;
using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Microsoft.AspNetCore.Authentication.OAuth;
using System.Net.Mail;
using System.Net;
using TeamCraft;
using System;


List<Person> users = new List<Person>
{
    new() { Id =1, name = "Tom",
        sureName = "f",databirthday=null,
        gender="�������", login="user",
        hashPassword="password",
        hobbiesPerson=null,
        skillsPerson="������� �� ����� �� �����",
        urlContact="�����"},
    new() { Id =2, name = "Bob",
        sureName = "j",databirthday=null,
        gender="�������",login="user",
        hashPassword = "password", 
        hobbiesPerson = null,
        skillsPerson = "������� �� ����� �� �����",
        urlContact = "�����"},
    new() { Id =3 ,name = "Sam", 
        sureName = "r",databirthday=null, 
        gender = "�������",
        login="user",
        hashPassword = "password", 
        hobbiesPerson = null, 
        skillsPerson = "������� �� ����� �� �����", 
        urlContact = "�����"}
};

var builder = WebApplication.CreateBuilder(args);

// �������� ������ ����������� �� ����� ������������
string connection = builder.Configuration.GetConnectionString("DefaultConnection");

// ��������� �������� ApplicationContext � �������� ������� � ����������
builder.Services.AddDbContext<DBConfigurator>(options => options.UseSqlServer(connection));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // ���������, ����� �� �������������� �������� ��� ��������� ������
            ValidateIssuer = true,
            // ������, �������������� ��������
            ValidIssuer = AuthOptions.ISSUER,
            // ����� �� �������������� ����������� ������
            ValidateAudience = true,
            // ��������� ����������� ������
            ValidAudience = AuthOptions.AUDIENCE,
            // ����� �� �������������� ����� �������������
            ValidateLifetime = false,
            // ��������� ����� ������������
            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
            // ��������� ����� ������������
            ValidateIssuerSigningKey = true,
        };
    });

var app = builder.Build();

app.MapGet("/", async delegate (HttpContext context, DBConfigurator db)
{
    CategoryHobby test = new CategoryHobby() {  nameHobby = "test"};
    await db.categoryHobbies.AddAsync(test);
    await db.SaveChangesAsync();
    return db.categoryHobbies.ToList();
    //var coord = db.Coordinate.ToList();
    //return db.Users.ToList();
});
app.MapGet("/api/users", () => users);
app.MapGet("/api/users/{id}", (string id) =>
{
    // �������� ������������ �� id
    Person? user = users.FirstOrDefault(u => u.Id == int.Parse(id));
    // ���� �� ������, ���������� ��������� ��� � ��������� �� ������
    if (user == null) 
        return Results.NotFound(new { message = "������������ �� ������" });

    // ���� ������������ ������, ���������� ���   
    return Results.Json(user);
});

app.MapPost("/api/users/registration/", async delegate (HttpContext context)
{
    Person user = await context.Request.ReadFromJsonAsync<Person>();
    user.Id = users.Count() - 1;
    var claims = new List<Claim> { new Claim(ClaimTypes.Name, user.login) };
    users.Add(user);
    return user;
});

app.MapPost("/api/users/login/", async delegate (HttpContext context)
{

    AutorizationData user = await context.Request.ReadFromJsonAsync<AutorizationData>();
    Person usernew = users.FirstOrDefault(u => u.login == user.login && u.hashPassword==user.password);
    if (usernew == null) 
        return Results.NotFound(new { message = "�������� ����� ��� ������" });
    return Results.Json(usernew);
});

app.MapPut("/api/users/change", async delegate (HttpContext context)
{

    Person user = await context.Request.ReadFromJsonAsync<Person>();
    Person usernew = users.FirstOrDefault(u => u.Id == user.Id && u.hashPassword == user.hashPassword);
    if (usernew == null)
        return Results.NotFound(new { message = "�������� ������" });
    usernew.name = user.name;
    usernew.sureName = user.sureName;
    usernew.hashPassword = user.hashPassword;
    usernew.skillsPerson = user.skillsPerson;
    usernew.urlContact = user.urlContact;
    usernew.hobbiesPerson = user.hobbiesPerson;
    usernew.login = user.login;
    usernew.databirthday = user.databirthday;
    usernew.gender = user.gender;
    return Results.Json(usernew);
});

app.MapGet("/api/user/login/{id}", (string id) =>
{
    var claims = new List<Claim> { new Claim(ClaimTypes.Name, id) };
    var jwt = new JwtSecurityToken(
            issuer: AuthOptions.ISSUER,
            audience: AuthOptions.AUDIENCE,
            claims: claims,
            expires: null, // ������ �������� 
            signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

    return new JwtSecurityTokenHandler().WriteToken(jwt);
});

app.MapPost("/api/profile/restoration/", async delegate (HttpContext context)
{
    EmailData email = await context.Request.ReadFromJsonAsync<EmailData>();
    // �������� ������
    using (MailMessage mail = new MailMessage())
    {
        mail.From = new MailAddress("proverka_2121@mail.ru"); // ����� �����������
        mail.To.Add(email.Email); // ����� ����������
        mail.Subject = "��������"; // ���� ������
        mail.Body = "�� ������"; // ����� ������

        using (SmtpClient smtp = new SmtpClient("smtp.mail.ru")) // ������� SMTP ������
        {
            smtp.Port = 587; // ������� ���� �������
            smtp.Credentials = new System.Net.NetworkCredential("proverka_2121@mail.ru", "TRbrPTp31rs*"); // ������� ������� ������ ��� �����������
            smtp.EnableSsl = false; // ��������� SSL-���������� (���� ����������)

            try
            {
                smtp.Send(mail); // �������� ������
                Console.WriteLine("������ ������� ���������� �� " + email.Email);
            }
            catch (Exception ex)
            {
                Console.WriteLine("������ ��� �������� ������: " + ex.ToString());
            }
        }
    }
});