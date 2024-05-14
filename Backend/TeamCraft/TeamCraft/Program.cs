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
app.UseCors(builder => builder.WithOrigins("http://45.58.159.81:80/", "https://45.58.159.81:443/")
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
    AccountUser user = new AccountUser();
    if (statusRequestUser.statusCode == 200)
    {
        user = new AccountUser(userForm);
        db.accountsUser.Add(user);
        await db.SaveChangesAsync();
        statusRequestUser.message.Add("successful addition");
    }
    context.Response.StatusCode = statusRequestUser.statusCode;
    return  JsonConvert.SerializeObject((statusRequestUser,user));
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

app.MapPut("/api/profile/", async delegate (HttpContext context, DBConfigurator db)
{
    AccountUser? accountUserJson = await context.Request.ReadFromJsonAsync<AccountUser>();
    AccountUser? accountJwt = Helper.FindUserFromClaim(context.User.Claims,db);

    if(accountJwt == null || accountUserJson == null)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Не найден акаунт пользователя");
    }
    if(!(accountJwt.id == accountUserJson.id && accountJwt.dataUserId == accountUserJson.dataUserId && accountUserJson.settingsUserId == accountJwt.settingsUserId))
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Не сходится редактируемый профиль и пользователь, от чьего лица редактируется профиль");
    }

    try
    {
        accountJwt.dataUser =accountUserJson.dataUser;
        accountUserJson.settingsUser.isHiddeInResearch = accountUserJson.settingsUser.isHiddeInResearch;
        accountUserJson.settingsUser.isHiddenData = accountUserJson.settingsUser.isHiddenData;
        await db.SaveChangesAsync();
        return JsonConvert.SerializeObject(accountJwt);
    }
    catch 
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Ошибка записи");
    }

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();

app.MapGet("/api/profiles/", async delegate (HttpContext context, DBConfigurator db)
{
    List<AccountUser> accountUsers = db.accountsUser.Include(account => account.settingsUser).Include(account => account.dataUser).ThenInclude(data => data.skillsPerson).ToList();

    List<DataUser> data = accountUsers.Where(account => !account.settingsUser.isHiddeInResearch || !account.dataUser.inTeam).Select(accout => accout.dataUser).ToList();

    return data;
});

app.MapPost("/api/profiles/filter", async delegate (HttpContext context, DBConfigurator db)
{
    List<SkillPerson> skillsJson = await context.Request.ReadFromJsonAsync<List<SkillPerson>>();

    //if (skillsJson.Count == 0)
    //    return HttpResponse.Redirect("/api/profiles/");

    List<AccountUser> accountUsers = db.accountsUser.Include(account => account.settingsUser).Include(account => account.dataUser).ThenInclude(data => data.skillsPerson).ToList();

    List<DataUser> data = accountUsers.Where(account => !account.settingsUser.isHiddeInResearch || !account.dataUser.inTeam).Select(accout => accout.dataUser).ToList();

    return data.Where(dataUser => skillsJson.All(x => dataUser.skillsPerson.Contains(x))).ToList();

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
    List<Team> teams = db.Teams.Include(teams => teams.team_stack).Include(team => team.Jion_means).Include(teams => teams.MemberTeam).ThenInclude(teams => teams.dataMemberUser).ToList();
    return JsonConvert.SerializeObject(teams);

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());




app.MapPost("/api/teams/create", async delegate (HttpContext context, DBConfigurator db)
{
    Team team = await context.Request.ReadFromJsonAsync<Team>();
    RequestStatus requestStatus = DataValidator.CheckCorrectTeamData(team, db);

    if(requestStatus.statusCode == 200)
    {
        List<SkillPerson> stack = new List<SkillPerson>();
        foreach (var sk in team.team_stack)
            stack.Add(db.skillPeople.Where(c => c.nameSkill == sk.nameSkill).FirstOrDefault());
        team.team_stack = stack;
        AccountUser? ownerTeam = Helper.FindUserFromClaim(context.User.Claims, db);
        if(ownerTeam == null)
        {
            context.Response.StatusCode = 400;
            return JsonConvert.SerializeObject("Не найден акаунт пользователя, от лица которого создают команду");
        }
        team.AddPersonInTeam(new MemberTeam(ownerTeam.dataUser, team, TypeRoleMember.owner));
        db.Teams.Add(team);
        await db.SaveChangesAsync();

        return JsonConvert.SerializeObject(team);
    }   

    context.Response.StatusCode = requestStatus.statusCode;
    return JsonConvert.SerializeObject(requestStatus);

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();


app.MapPut("/api/teams/edit",  async  delegate  (HttpContext context, DBConfigurator db) 
{

    Team team = await context.Request.ReadFromJsonAsync<Team>();
    RequestStatus requestStatusInput = DataValidator.CheckCorrectTeamData(team, db);

    if (requestStatusInput.statusCode == 200)
    {
        bool teamInBase = db.Teams.Count(tm => tm.Id == team.Id) == 1;
        if (!teamInBase)
        {
            context.Response.StatusCode = 400;
            return JsonConvert.SerializeObject("Not find id team");
        }

        await db.Teams.Where(tm => tm.Id == team.Id).ExecuteUpdateAsync(objec => objec.
            SetProperty(obj => obj.MemberTeam, obj => team.MemberTeam).
            SetProperty(obj => obj.Jion_means, obj => team.Jion_means).
            SetProperty(obj => obj.teamName, obj => team.teamName).
            SetProperty(obj => obj.teamGoal, obj => team.teamGoal).
            SetProperty(obj => obj.teamDescription, obj => team.teamDescription).
            SetProperty(obj => obj.team_stack, obj => team.team_stack));
        await db.SaveChangesAsync();
        return JsonConvert.SerializeObject(team);
    }

    context.Response.StatusCode = requestStatusInput.statusCode;
    return JsonConvert.SerializeObject(requestStatusInput);
}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());

app.MapPut("/api/team/require/{idTeam}", async delegate (HttpContext context, DBConfigurator db, int idTeam)
{
    Team? teamDb = db.Teams.Include(team => team.Jion_means).FirstOrDefault(team => team.Id == idTeam);
    DataUser? userDb = Helper.FindUserFromClaim(context.User.Claims,db)?.dataUser;
    if (teamDb == null || userDb == null)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Not found id team or user");
    }

    teamDb.Jion_means.Add(userDb);
    await db.SaveChangesAsync();
    return JsonConvert.SerializeObject(db.Teams.Include(team => team.Jion_means).FirstOrDefault(team => team.Id == idTeam));
}
).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();

app.MapPut("/api/team/acceptRequire/{idTeam}-{idUser}", async delegate (HttpContext context, DBConfigurator db, int idTeam, int idUser)
{
    Team? teamDb = db.Teams.Include(team => team.Jion_means).Include(team => team.MemberTeam).FirstOrDefault(team => team.Id == idTeam);
    DataUser? userDb = db.dataUser.FirstOrDefault(dataUser => dataUser.Id == idUser);
    AccountUser? ownerAccount = Helper.FindUserFromClaim(context.User.Claims, db);

    if (teamDb == null || userDb == null || ownerAccount == null)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Not found id team or user id or owner id");
    }

    MemberTeam? owner = db.memberTeams.FirstOrDefault(member => member.dataMemberUserId == Helper.FindUserFromClaim(context.User.Claims, db).dataUserId);
    
    if(teamDb.MemberTeam.FirstOrDefault(member => member.roleMember == TypeRoleMember.owner).dataMemberUserId == ownerAccount.dataUserId)
    {
        if (teamDb.Jion_means.Contains(userDb))
            teamDb.Jion_means.Remove(userDb);
        else
        {
            context.Response.StatusCode = 400;
            return JsonConvert.SerializeObject("User not exists in list require team");
        }
        userDb.inTeam = true;
        MemberTeam memberTeam = new MemberTeam(userDb, teamDb);
        teamDb.MemberTeam.Add(memberTeam);
        await db.SaveChangesAsync();
        return JsonConvert.SerializeObject(db.Teams.Include(team => team.Jion_means).Include(team => team.MemberTeam).FirstOrDefault(team => team.Id == idTeam));
    }
    else
    {
        context.Response.StatusCode = 403;
        return JsonConvert.SerializeObject("Пользователь сделавший запрос не является руководителем команды");
    }

   
}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();

app.MapPut("/api/team/cancelledRequire/{idTeam}-{idUser}", async delegate (HttpContext context, DBConfigurator db, int idTeam, int idUser)
{
    Team? teamDb = db.Teams.Include(team => team.Jion_means).Include(team => team.MemberTeam).FirstOrDefault(team => team.Id == idTeam);
    DataUser? userDb = db.dataUser.FirstOrDefault(dataUser => dataUser.Id == idUser);
    AccountUser? ownerAccount = Helper.FindUserFromClaim(context.User.Claims, db);

    if (teamDb == null || userDb == null || ownerAccount == null)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Not found id team or user id or owner id");
    }

    //MemberTeam? owner = db.memberTeams.FirstOrDefault(member => member.dataMemberUserId == ownerAccount.dataUserId);

    if (teamDb.MemberTeam.FirstOrDefault(member => member.roleMember == TypeRoleMember.owner).dataMemberUserId == ownerAccount.dataUserId)
    {
        if (teamDb.Jion_means.Contains(userDb))
            teamDb.Jion_means.Remove(userDb);
        else
        {
            context.Response.StatusCode = 400;
            return JsonConvert.SerializeObject("User not exists in list require team");
        }

        await db.SaveChangesAsync();
        return JsonConvert.SerializeObject(db.Teams.Include(team => team.Jion_means).Include(team => team.MemberTeam).FirstOrDefault(team => team.Id == idTeam));
    }
    else
    {
        context.Response.StatusCode = 403;
        return JsonConvert.SerializeObject("Пользователь сделавший запрос не является руководителем команды");
    }

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();

app.MapPut("/api/teams/deleteMember/{idTeam}-{idMember}", async delegate (HttpContext context, DBConfigurator db, int idTeam, int idMember)
{
    Team? targetTeam = db.Teams.Include(team => team.Jion_means).Include(team => team.MemberTeam).ThenInclude(member => member.dataMemberUser).FirstOrDefault(team => team.Id == idTeam);
    MemberTeam? targetMember = targetTeam.MemberTeam.FirstOrDefault(member => member.Id == idMember);
    AccountUser? ownerAccount = Helper.FindUserFromClaim(context.User.Claims, db);

    if (targetMember == null || targetTeam == null || ownerAccount == null)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Not exists team, owner or target Delete Person");
    }

    if (targetTeam.MemberTeam.FirstOrDefault(member => member.roleMember == TypeRoleMember.owner).dataMemberUserId == ownerAccount.dataUserId)
    {
        targetMember.dataMemberUser.inTeam = false;
        targetTeam.MemberTeam.Remove(targetMember);
        await db.SaveChangesAsync();
        return JsonConvert.SerializeObject(targetTeam);
    }
    else
    {
        context.Response.StatusCode = 403;
        return JsonConvert.SerializeObject("Пользователь сделавший запрос не является руководителем команды");
    }


        
}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();


app.MapPost("/api/teams/filter", async delegate (HttpContext context, DBConfigurator db)
{
    List<SkillPerson> skillsJson = await context.Request.ReadFromJsonAsync<List<SkillPerson>>();

    if(skillsJson.Count == 0)
        return db.Teams.Include(team => team.team_stack).Include(team => team.Jion_means).Include(team => team.MemberTeam).ThenInclude(c => c!.dataMemberUser).ToList();

    List<Team> team = db.Teams.Include(team => team.team_stack).Include(team => team.MemberTeam).Include(team => team.Jion_means).ToList();

    return team.Where(team => skillsJson.All(x => team.team_stack.Contains(x))).ToList();

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());


app.MapGet("/api/data",  (HttpContext context) => $"Successfully!").RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();

app.MapGet("/api/test",async delegate (HttpContext http, DBConfigurator db) 
{
    return Helper.FindUserFromClaim(http.User.Claims, db);
   
});

app.Run();
