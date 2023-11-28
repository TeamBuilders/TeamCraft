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
        gender="вертолёт", login="user",
        hashPassword="password",
        hobbiesPerson=null,
        skillsPerson="плакать по ночам от ужаса",
        urlContact="немае"},
    new() { Id =2, name = "Bob",
        sureName = "j",databirthday=null,
        gender="вертолёт",login="user",
        hashPassword = "password", 
        hobbiesPerson = null,
        skillsPerson = "плакать по ночам от ужаса",
        urlContact = "немае"},
    new() { Id =3 ,name = "Sam", 
        sureName = "r",databirthday=null, 
        gender = "вертолёт",
        login="user",
        hashPassword = "password", 
        hobbiesPerson = null, 
        skillsPerson = "плакать по ночам от ужаса", 
        urlContact = "немае"}
};

var builder = WebApplication.CreateBuilder(args);

// получаем строку подключения из файла конфигурации
string connection = builder.Configuration.GetConnectionString("DefaultConnection");

// добавляем контекст ApplicationContext в качестве сервиса в приложение
builder.Services.AddDbContext<DBConfigurator>(options => options.UseSqlServer(connection));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // указывает, будет ли валидироваться издатель при валидации токена
            ValidateIssuer = true,
            // строка, представляющая издателя
            ValidIssuer = AuthOptions.ISSUER,
            // будет ли валидироваться потребитель токена
            ValidateAudience = true,
            // установка потребителя токена
            ValidAudience = AuthOptions.AUDIENCE,
            // будет ли валидироваться время существования
            ValidateLifetime = false,
            // установка ключа безопасности
            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
            // валидация ключа безопасности
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
    // получаем пользователя по id
    Person? user = users.FirstOrDefault(u => u.Id == int.Parse(id));
    // если не найден, отправляем статусный код и сообщение об ошибке
    if (user == null) 
        return Results.NotFound(new { message = "Пользователь не найден" });

    // если пользователь найден, отправляем его   
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
        return Results.NotFound(new { message = "Неверный логин или пароль" });
    return Results.Json(usernew);
});

app.MapPut("/api/users/change", async delegate (HttpContext context)
{

    Person user = await context.Request.ReadFromJsonAsync<Person>();
    Person usernew = users.FirstOrDefault(u => u.Id == user.Id && u.hashPassword == user.hashPassword);
    if (usernew == null)
        return Results.NotFound(new { message = "Неверный пароль" });
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
            expires: null, // всегда работает 
            signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

    return new JwtSecurityTokenHandler().WriteToken(jwt);
});

app.MapPost("/api/profile/restoration/", async delegate (HttpContext context)
{
    EmailData email = await context.Request.ReadFromJsonAsync<EmailData>();
    // Отправка письма
    // Настройки SMTP-сервера Mail.ru
    string smtpServer = "smtp.mail.ru";
    int smtpPort = 587; 
    string smtpUsername = "proverka_2121@mail.ru"; //твоя почта, с которой отправляется сообщение
    string smtpPassword = "iRzNgtp4J8UKaT515daf";//пароль приложения (от почты)

    // Создаем объект клиента SMTP
    using (SmtpClient smtpClient = new SmtpClient(smtpServer, smtpPort))
    {
        // Настройки аутентификации
        smtpClient.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
        smtpClient.EnableSsl = true;

        using (MailMessage mailMessage = new MailMessage())
        {
            mailMessage.From = new MailAddress(smtpUsername);
            mailMessage.To.Add(email.Email); // Укажите адрес получателя
            mailMessage.Subject = "Заголовок сообщения (тема)";
            mailMessage.Body = $"Текст сообщения";

            try
            {
                // Отправляем сообщение
                smtpClient.Send(mailMessage);
                Console.WriteLine("Сообщение успешно отправлено.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка отправки сообщения: {ex.Message}");
            }
        }
    }
});
app.Run();