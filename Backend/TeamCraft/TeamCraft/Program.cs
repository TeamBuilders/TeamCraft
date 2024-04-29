using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using TeamCraft.DataBaseController;
using TeamCraft.FilterLogic;
using TeamCraft.Model.UserAcrhitecture;
using System.Net.Mail;
using System.Net;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using TeamCraft.JwtData;
using TeamCraft.JsonParsersClasses;
using TeamCraft.Model;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TeamCraft.Model.TeamsArchitecture;


var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin();
            builder.AllowAnyHeader();
            builder.AllowAnyMethod();
        });
});


string connection = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<DBConfigurator>(options => options.UseSqlite(connection));

builder.Services.AddControllers()
       .AddJsonOptions(options =>
       {
           options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
       });

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

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});
var app = builder.Build();
app.UseCors(builder => builder.WithOrigins("http://localhost:7039", "https://localhost:7039")
              .SetIsOriginAllowedToAllowWildcardSubdomains()
              .AllowAnyHeader()
              .AllowCredentials()
              .WithMethods("GET", "PUT", "POST", "DELETE", "OPTIONS"));
app.UseAuthentication();
app.UseAuthorization();



// Метод восстановления пароля через почту
app.MapPost("/api/profile/restoration/", async delegate (HttpContext context, DBConfigurator db)
{
    Random random = new Random();
    int randomNumber = random.Next(100000, 999999);
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
        email.code = randomNumber;
        db.Emails.Add(email);
        await db.SaveChangesAsync();
        using (MailMessage mailMessage = new MailMessage())
        {
            mailMessage.From = new MailAddress(smtpUsername);
            mailMessage.To.Add(email.email); // Укажите адрес получателя
            mailMessage.Subject = "Заголовок сообщения (тема)";
            mailMessage.Body = $"код:{randomNumber}";

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
app.MapPost("/api/profile/restoration/code/", async delegate (HttpContext context, DBConfigurator db)
{
    EmailData emailData = await context.Request.ReadFromJsonAsync<EmailData>();

    int? searcode = emailData.code;

    EmailData emaild =  db.Emails.FirstOrDefault(x => x.code == searcode);

    string email = emaild.email;

    SettingsProfileUser accountUser = await db.settingsProfileUser.FirstOrDefaultAsync(x => x.email == email);

    accountUser.rest = 1;
    db.Emails.Remove(emaild);
    db.SaveChangesAsync();
    

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());





app.MapPost("/api/profile/restoration/end", async delegate (HttpContext context, DBConfigurator db)
{
    LoginForm loginORpassword = await context.Request.ReadFromJsonAsync<LoginForm>();

    int rest = 1;

    SettingsProfileUser user = db.settingsProfileUser.FirstOrDefault(x => x.rest == rest);
    if (loginORpassword.login==null)
    {
        user.hashPassword = Helper.ComputeSHA512(loginORpassword.password);
    }
    else
    {
        user.login= loginORpassword.login;
    }
    user.rest = 0;
    db.SaveChangesAsync();


}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());



app.MapPost("/api/register", async delegate (HttpContext context, DBConfigurator db)
{
    RegistrationForm? userForm = await context.Request.ReadFromJsonAsync<RegistrationForm>();
    RequestStatus statusRequestUser = DataValidator.CheckCorrectUserData(userForm, db);
    if(statusRequestUser.statusCode == 200)
    {
        AccountUser user = new AccountUser(userForm);
        db.accountsUser.Add(user);
        await db.SaveChangesAsync();
        statusRequestUser.message.Add("successful addition");
    }
    context.Response.StatusCode = statusRequestUser.statusCode;
    return  JsonConvert.SerializeObject(statusRequestUser);
}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());





app.MapPost("/api/login", async delegate (HttpContext context, DBConfigurator db)
{
    LoginForm? logForm = await context.Request.ReadFromJsonAsync<LoginForm>();
    RequestStatus statusRequestUser = DataValidator.CheckCorrectLoginData(logForm, db);
    if (statusRequestUser.statusCode == 200)
    {
        AccountUser account = db.accountsUser.FirstOrDefault(users => users.settingsUser.hashPassword == Helper.ComputeSHA512(logForm.password) && users.settingsUser.login == logForm.login);
        var claims = new List<Claim> { new Claim(logForm.login, logForm.password) };
        var jwt = new JwtSecurityToken(
                issuer: AuthOptions.ISSUER,
                audience: AuthOptions.AUDIENCE,
                claims: claims,
                expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(2)), // время действия 2 минуты
                signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

        var response = new
        {
            user = account,
            jwtToken = new JwtSecurityTokenHandler().WriteToken(jwt)
        };

        //return new JwtSecurityTokenHandler().WriteToken(jwt);
        return JsonConvert.SerializeObject(response);
    }
    context.Response.StatusCode = statusRequestUser.statusCode;
    return JsonConvert.SerializeObject(statusRequestUser);
}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());



app.MapGet("/api/hobby", async delegate (HttpContext context, DBConfigurator db)
{
    return db.categoryHobbies.Include(x => x.skillPeople).ToList();
}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());
app.MapGet("/api/skill/{number}", async delegate (HttpContext context, DBConfigurator db, int number)
{
    if (number < db.categoryHobbies.ToList().Count && number > 0)
        return JsonConvert.SerializeObject(db.skillPeople.Where(x => x.categoryHobbyId == number).ToList());
    else
        return JsonConvert.SerializeObject("Inccorect number");
}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());

app.MapGet("/api/teams", async delegate (HttpContext context, DBConfigurator db)
{
    List<Team> teams = db.Teams.Include(teams => teams.MemberTeam).ToList();
    return JsonConvert.SerializeObject(teams);

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());

app.MapPost("/api/teams/join", async delegate (HttpContext context, DBConfigurator db)
{
    Team team = await context.Request.ReadFromJsonAsync<Team>();
    Team oldteam = db.Teams.FirstOrDefault(x => x.team_lead == team.team_lead);
    oldteam.Jion_means = team.Jion_means;
    await db.SaveChangesAsync();

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());

app.MapPost("/api/teams", async delegate (HttpContext context, DBConfigurator db)
{
    List<Team> teams = db.Teams.ToList();
    return JsonConvert.SerializeObject(teams);

});

app.MapPost("/api/teams/join", async delegate (HttpContext context, DBConfigurator db)
{
    Team team = await context.Request.ReadFromJsonAsync<Team>();
    Team oldteam = db.Teams.FirstOrDefault(x => x.team_lead == team.team_lead);
    oldteam.Jion_means = team.Jion_means;
    db.SaveChangesAsync();

});


app.MapPost("/api/teams/create", async delegate (HttpContext context, DBConfigurator db)
{
    Team team = await context.Request.ReadFromJsonAsync<Team>();

    db.Teams.Add(team);
    db.SaveChangesAsync();

});
app.MapPost("/api/teams/edit", async delegate (HttpContext context, DBConfigurator db)
{
    Team team = await context.Request.ReadFromJsonAsync<Team>();
    List<MemberTeam> newmemb = team.MemberTeam;
    string team_lead = team.team_lead;
    Team oldteam = db.Teams.FirstOrDefault(x => x.team_lead == team_lead);
    oldteam.teamName = team.teamName;
    oldteam.teamDescription = team.teamDescription;
    oldteam.teamGoal = team.teamGoal;
    List<MemberTeam> oldmemb = oldteam.MemberTeam;
    int id = 0;
    if (oldmemb.Last().Id > newmemb.Last().Id)
    {

        int f = 0;
        for (int i = 0; i <= newmemb.Last().Id; i++)
        {
            if (oldmemb[i + f].Id != newmemb[i].Id)
            {
                id = oldmemb[i].dataMemberUser.Id;
                f++;
            }
            if (f == 0)
            {
                id = oldmemb[i + 1].dataMemberUser.Id;

            }
        }
        DataUser user = db.dataUser.FirstOrDefault(x => x.Id == id);
        user.inTeam = false;
    }
    else
    {
        int f = 0;
        for (int i = 0; i <= oldmemb.Last().Id; i++)
        {
            if (oldmemb[i].Id != newmemb[i + f].Id)
            {
                id = newmemb[i].dataMemberUser.Id;
                f++;
            }
            if (f == 0)
            {
                id = newmemb[i + 1].dataMemberUser.Id;

            }
        }
        DataUser user = db.dataUser.FirstOrDefault(x => x.Id == id);
        user.inTeam = true;
    }
    oldteam.MemberTeam = team.MemberTeam;
    db.SaveChangesAsync();

});





app.MapPost("/api/teams/create", async delegate (HttpContext context, DBConfigurator db)
{
    Team team = await context.Request.ReadFromJsonAsync<Team>();
    List<SkillPerson> stack = new List<SkillPerson>();
    foreach (var sk in team.team_stack)
        stack.Add(db.skillPeople.Where(c => c.nameSkill == sk.nameSkill).FirstOrDefault());
    team.team_stack = stack;
    db.Teams.Add(team);
    await db.SaveChangesAsync();

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());


app.MapPost("/api/teams/edit", async delegate (HttpContext context, DBConfigurator db)
{
    Team team = await context.Request.ReadFromJsonAsync<Team>();
    List<MemberTeam> newmemb = team.MemberTeam;
    string team_lead = team.team_lead;
    Team oldteam = db.Teams.FirstOrDefault(x => x.team_lead == team_lead);
    oldteam.teamName = team.teamName;
    oldteam.teamDescription = team.teamDescription;
    oldteam.teamGoal = team.teamGoal;
    List<MemberTeam> oldmemb = oldteam.MemberTeam.ToList();
    List<MemberTeam> oldjoin = oldteam.Jion_means.ToList();
    int id = 0;
    if (oldmemb.Last().Id > newmemb.Last().Id)
    {

        int f = 0;
        for (int i = 0; i <= newmemb.Last().Id; i++)
        {
            if (oldmemb[i + f].Id != newmemb[i].Id)
            {
                id = oldmemb[i].dataMemberUser.Id;
                f++;
            }
            if (f == 0)
            {
                id = oldmemb[i + 1].dataMemberUser.Id;

            }
        }
        DataUser user = db.dataUser.FirstOrDefault(x => x.Id == id);
        user.inTeam = false;
    }
    else
    {
        int f = 0;
        for (int i = 0; i <= oldmemb.Last().Id; i++)
        {
            if (oldmemb[i].Id != newmemb[i + f].Id)
            {
                id = newmemb[i].dataMemberUser.Id;
                f++;
            }
            if (f == 0)
            {
                id = newmemb[i + 1].dataMemberUser.Id;

            }
        }
        DataUser user = db.dataUser.FirstOrDefault(x => x.Id == id);
        user.inTeam = true;
    }
    oldteam.MemberTeam = team.MemberTeam;
    await db.SaveChangesAsync();

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());


app.MapPost("/api/teams/filter", async delegate (HttpContext context, DBConfigurator db)
{
    List<SkillPerson> skillsJson = await context.Request.ReadFromJsonAsync<List<SkillPerson>>();

    if(skillsJson.Count == 0)
        return db.Teams.Include(team => team.team_stack).Include(team => team.Jion_means).Include(team => team.MemberTeam).ThenInclude(c => c!.dataMemberUser).ToList();

    List<Team> team = db.Teams.Include(team => team.team_stack).Include(team => team.MemberTeam).Include(team => team.Jion_means).ToList();

    return team.Where(team => skillsJson.All(x => team.team_stack.Contains(x))).ToList();

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());


app.MapGet("/api/data", [Authorize] (HttpContext context) => $"Successfully!").RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()); ;

app.Run();
