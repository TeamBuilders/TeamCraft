using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;
using TeamCraft.DataBaseController;
using TeamCraft.FilterLogic;
using TeamCraft.JsonParsersClasses;
using TeamCraft.JwtData;
using TeamCraft.Model;
using TeamCraft.Model.Posts;
using TeamCraft.Model.TeamsArchitecture;
using TeamCraft.Model.UserAcrhitecture;


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

            ValidateIssuer = true,

            ValidIssuer = AuthOptions.ISSUER,

            ValidateAudience = true,

            ValidAudience = AuthOptions.AUDIENCE,

            ValidateLifetime = false,

            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),

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




app.MapPost("/api/profile/restoration/", async delegate (HttpContext context, DBConfigurator db)
{
    Random random = new Random();
    int randomNumber = random.Next(100000, 999999);
    EmailData email = await context.Request.ReadFromJsonAsync<EmailData>();

    string smtpServer = "smtp.mail.ru";
    int smtpPort = 587;
    string smtpUsername = "proverka_2121@mail.ru";
    string smtpPassword = "iRzNgtp4J8UKaT515daf";

    // Создаем объект клиента SMTP
    using (SmtpClient smtpClient = new SmtpClient(smtpServer, smtpPort))
    {

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

    EmailData emaild = db.Emails.FirstOrDefault(x => x.code == searcode);

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
    if (loginORpassword.login == null)
    {
        user.hashPassword = Helper.ComputeSHA512(loginORpassword.password);
    }
    else
    {
        user.login = loginORpassword.login;
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
    return JsonConvert.SerializeObject((statusRequestUser, user));
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

        return JsonConvert.SerializeObject(response);
    }
    context.Response.StatusCode = statusRequestUser.statusCode;
    return JsonConvert.SerializeObject(statusRequestUser);
}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());

app.MapPost("/api/profile/", async delegate (HttpContext context, DBConfigurator db)
{
    AccountUser? accountUserJson = await context.Request.ReadFromJsonAsync<AccountUser>();
    AccountUser? accountJwt = Helper.FindUserFromClaim(context.User.Claims, db);

    if (accountJwt == null || accountUserJson == null)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Не найден акаунт пользователя");
    }
    if (!(accountJwt.id == accountUserJson.id && accountJwt.dataUserId == accountUserJson.dataUserId && accountUserJson.settingsUserId == accountJwt.settingsUserId))
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Не сходится редактируемый профиль и пользователь, от чьего лица редактируется профиль");
    }

    try
    {
        accountJwt.dataUser.skillsPerson = accountUserJson.dataUser.skillsPerson;
        accountJwt.dataUser.goalsPerson = accountUserJson.dataUser.goalsPerson;
        accountJwt.dataUser.urlContact = accountUserJson.dataUser.urlContact;
        accountJwt.dataUser.databirthday = accountUserJson.dataUser.databirthday;
        accountJwt.dataUser.descriptionUser = accountUserJson.dataUser.descriptionUser;
        accountJwt.dataUser.name = accountUserJson.dataUser.name;
        accountJwt.dataUser.sureName = accountUserJson.dataUser.sureName;
        accountJwt.dataUser.gender = accountUserJson.dataUser.gender;
        accountJwt.settingsUser.isHiddeInResearch = accountUserJson.settingsUser.isHiddeInResearch;
        accountJwt.settingsUser.isHiddenData = accountUserJson.settingsUser.isHiddenData;
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

    List<DataUser> data = accountUsers.Where(account => !(account.settingsUser.isHiddeInResearch || account.dataUser.inTeam)).Select(accout => accout.dataUser).ToList();

    return data;
}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());

app.MapGet("/api/profiles/filter", async delegate (HttpContext context, DBConfigurator db)
{
    List<SkillPerson> skillsJson = await context.Request.ReadFromJsonAsync<List<SkillPerson>>();

    List<AccountUser> accountUsers = db.accountsUser.Include(account => account.settingsUser).Include(account => account.dataUser).ThenInclude(data => data.skillsPerson).ToList();

    List<DataUser> data = accountUsers.Where(account => !(account.settingsUser.isHiddeInResearch || account.dataUser.inTeam)).Select(accout => accout.dataUser).ToList();

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
    List<Team> teams = db.Teams.Include(teams => teams.team_stack).Include(team => team.jion_means).Include(teams => teams.memberTeam).ThenInclude(teams => teams.dataMemberUser).ToList();
    return JsonConvert.SerializeObject(teams);

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());




app.MapPost("/api/teams/create", async delegate (HttpContext context, DBConfigurator db)
{
    Team team = await context.Request.ReadFromJsonAsync<Team>();
    RequestStatus requestStatus = DataValidator.CheckCorrectTeamData(team, db);

    if (requestStatus.statusCode == 200)
    {
        List<SkillPerson> stack = new List<SkillPerson>();
        foreach (var sk in team.team_stack)
            stack.Add(db.skillPeople.Where(c => c.nameSkill == sk.nameSkill).FirstOrDefault());
        team.team_stack = stack;
        AccountUser? ownerTeam = Helper.FindUserFromClaim(context.User.Claims, db);
        if (ownerTeam == null)
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


app.MapPost("/api/teams/edit", async delegate (HttpContext context, DBConfigurator db)
{

    Team team = await context.Request.ReadFromJsonAsync<Team>();
    RequestStatus requestStatusInput = DataValidator.CheckCorrectTeamData(team, db);
    AccountUser? owner = Helper.FindUserFromClaim(context.User.Claims, db);

    if (owner == null || owner.dataUserId != team.memberTeam.FirstOrDefault(member => member.roleMember == TypeRoleMember.owner).dataMemberUserId)
    {
        context.Response.StatusCode = 403;
        return JsonConvert.SerializeObject("Не найден владелец или нет прав");
    }

    if (requestStatusInput.statusCode == 200)
    {
        Team? teamDb = db.Teams.FirstOrDefault(tm => tm.id == team.id);

        if (teamDb == null)
        {
            context.Response.StatusCode = 400;
            return JsonConvert.SerializeObject("Not find id team");
        }

        teamDb.team_stack = team.team_stack;
        teamDb.teamGoal = team.teamGoal;
        teamDb.teamName = team.teamName;
        teamDb.teamDescription = team.teamDescription;


        await db.SaveChangesAsync();
        return JsonConvert.SerializeObject(team);
    }

    context.Response.StatusCode = requestStatusInput.statusCode;
    return JsonConvert.SerializeObject(requestStatusInput);
}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();

app.MapPost("/api/team/require/{idTeam}", async delegate (HttpContext context, DBConfigurator db, int idTeam)
{
    Team? teamDb = db.Teams.Include(team => team.jion_means).FirstOrDefault(team => team.id == idTeam);
    DataUser? userDb = Helper.FindUserFromClaim(context.User.Claims, db)?.dataUser;
    if (teamDb == null || userDb == null)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Not found id team or user");
    }

    if (teamDb.jion_means.Count(mean => mean.id == userDb.id) > 0)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Пользователь уже дал заявку");
    }

    teamDb.jion_means.Add(userDb);
    await db.SaveChangesAsync();
    return JsonConvert.SerializeObject(db.Teams.Include(team => team.jion_means).FirstOrDefault(team => team.id == idTeam));
}
).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();

app.MapPost("/api/team/acceptRequire/{idTeam}-{idUser}", async delegate (HttpContext context, DBConfigurator db, int idTeam, int idUser)
{
    Team? teamDb = db.Teams.Include(team => team.jion_means).Include(team => team.memberTeam).FirstOrDefault(team => team.id == idTeam);
    DataUser? userDb = db.dataUser.FirstOrDefault(dataUser => dataUser.id == idUser);
    AccountUser? ownerAccount = Helper.FindUserFromClaim(context.User.Claims, db);

    if (teamDb == null || userDb == null || ownerAccount == null)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Not found id team or user id or owner id");
    }

    MemberTeam? owner = db.memberTeams.FirstOrDefault(member => member.dataMemberUserId == Helper.FindUserFromClaim(context.User.Claims, db).dataUserId);

    if (teamDb.memberTeam.FirstOrDefault(member => member.roleMember == TypeRoleMember.owner).dataMemberUserId == ownerAccount.dataUserId)
    {
        if (teamDb.jion_means.Contains(userDb))
            teamDb.jion_means.Remove(userDb);
        else
        {
            context.Response.StatusCode = 400;
            return JsonConvert.SerializeObject("User not exists in list require team");
        }
        userDb.inTeam = true;
        MemberTeam memberTeam = new MemberTeam(userDb, teamDb);
        teamDb.memberTeam.Add(memberTeam);
        await db.SaveChangesAsync();
        return JsonConvert.SerializeObject(db.Teams.Include(team => team.jion_means).Include(team => team.memberTeam).FirstOrDefault(team => team.id == idTeam));
    }
    else
    {
        context.Response.StatusCode = 403;
        return JsonConvert.SerializeObject("Пользователь сделавший запрос не является руководителем команды");
    }


}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();

app.MapPost("/api/team/cancelledRequire/{idTeam}-{idUser}", async delegate (HttpContext context, DBConfigurator db, int idTeam, int idUser)
{
    Team? teamDb = db.Teams.Include(team => team.jion_means).Include(team => team.memberTeam).FirstOrDefault(team => team.id == idTeam);
    DataUser? userDb = db.dataUser.FirstOrDefault(dataUser => dataUser.id == idUser);
    AccountUser? ownerAccount = Helper.FindUserFromClaim(context.User.Claims, db);

    if (teamDb == null || userDb == null || ownerAccount == null)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Not found id team or user id or owner id");
    }



    if (teamDb.memberTeam.FirstOrDefault(member => member.roleMember == TypeRoleMember.owner).dataMemberUserId == ownerAccount.dataUserId)
    {
        if (teamDb.jion_means.Contains(userDb))
            teamDb.jion_means.Remove(userDb);
        else
        {
            context.Response.StatusCode = 400;
            return JsonConvert.SerializeObject("User not exists in list require team");
        }

        await db.SaveChangesAsync();
        return JsonConvert.SerializeObject(db.Teams.Include(team => team.jion_means).Include(team => team.memberTeam).FirstOrDefault(team => team.id == idTeam));
    }
    else
    {
        context.Response.StatusCode = 403;
        return JsonConvert.SerializeObject("Пользователь сделавший запрос не является руководителем команды");
    }

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();

app.MapPost("/api/teams/deleteMember/{idTeam}-{idMember}", async delegate (HttpContext context, DBConfigurator db, int idTeam, int idMember)
{
    Team? targetTeam = db.Teams.Include(team => team.jion_means).Include(team => team.memberTeam).ThenInclude(member => member.dataMemberUser).FirstOrDefault(team => team.id == idTeam);
    MemberTeam? targetMember = targetTeam.memberTeam.FirstOrDefault(member => member.id == idMember);
    AccountUser? ownerAccount = Helper.FindUserFromClaim(context.User.Claims, db);

    if (targetMember == null || targetTeam == null || ownerAccount == null)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Not exists team, owner or target Delete Person");
    }

    if (targetTeam.memberTeam.FirstOrDefault(member => member.roleMember == TypeRoleMember.owner).dataMemberUserId == ownerAccount.dataUserId)
    {
        targetMember.dataMemberUser.inTeam = false;
        targetTeam.memberTeam.Remove(targetMember);
        await db.SaveChangesAsync();
        return JsonConvert.SerializeObject(targetTeam);
    }
    else
    {
        context.Response.StatusCode = 403;
        return JsonConvert.SerializeObject("Пользователь сделавший запрос не является руководителем команды");
    }



}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();

app.MapPost("/api/profile/exitTeam/{idTeam}", async delegate (HttpContext context, DBConfigurator db, int idTeam)
{
    AccountUser? ownerAccount = Helper.FindUserFromClaim(context.User.Claims, db);
    Team? team = db.Teams.Include(member => member.memberTeam).FirstOrDefault(team => team.id == idTeam);

    if (team == null || ownerAccount == null)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Not exists team or account user");
    }
    MemberTeam? member = team.memberTeam.FirstOrDefault(member => member.dataMemberUserId == ownerAccount.dataUserId);
    if (member == null)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Member dont exists in team");
    }

    team.memberTeam.Remove(member);
    await db.SaveChangesAsync();
    return JsonConvert.SerializeObject(team);

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();


app.MapPost("/api/teams/filter", async delegate (HttpContext context, DBConfigurator db)
{
    List<SkillPerson> skillsJson = await context.Request.ReadFromJsonAsync<List<SkillPerson>>();

    if (skillsJson.Count == 0)
        return db.Teams.Include(team => team.team_stack).Include(team => team.jion_means).Include(team => team.memberTeam).ThenInclude(c => c!.dataMemberUser).ToList();

    List<Team> team = db.Teams.Include(team => team.team_stack).Include(team => team.memberTeam).Include(team => team.jion_means).ToList();

    return team.Where(team => skillsJson.All(x => team.team_stack.Contains(x))).ToList();

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());


app.MapGet("/api/profile/includeTeam", async delegate (HttpContext context, DBConfigurator db)
{
    AccountUser? account = Helper.FindUserFromClaim(context.User.Claims, db);

    if (account == null)
    {
        context.Response.StatusCode = 403;
        return JsonConvert.SerializeObject("Не выполнен вход в аккаунт: не верный логин или пароль");
    }

    return JsonConvert.SerializeObject(db.memberTeams.Include(member => member.team).ThenInclude(team => team.team_stack).Include(team => team.team.memberTeam).Include(team => team.team.jion_means).Where(member => member.dataMemberUserId == account.id));

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();


app.MapGet("/api/team/{id}", async delegate (HttpContext context, DBConfigurator db, int id)
{
    Team? team = db.Teams.Include(teams => teams.team_stack).Include(teams => teams.jion_means).Include(teams => teams.memberTeam).FirstOrDefault(teams => teams.id == id);

    if (team == null)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Команда не найдена");
    }

    return JsonConvert.SerializeObject(team);
}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());



app.MapPost("/api/team/invite/{idDataUserInvited}-{idTeam}", async delegate (HttpContext context, DBConfigurator db, int idDataUserInvited, int idTeam)
{
    DataUser? accountOwnerTeam = Helper.FindUserFromClaim(context.User.Claims, db)?.dataUser;
    DataUser? dataInvtePerson = db.dataUser.FirstOrDefault(data => data.id == idDataUserInvited);
    Team? targetTeam = db.Teams.FirstOrDefault(data => data.id == idTeam);

    if (accountOwnerTeam == null || dataInvtePerson == null || targetTeam == null) 
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("not find team or Inveted User");
    }
    if (!targetTeam.memberTeam.Select(member => member.dataMemberUserId).Contains(accountOwnerTeam.id))
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Пригласивший не находится в команде куда приглашает");
    }
    if(targetTeam.memberTeam.Find(data => data.dataMemberUserId == accountOwnerTeam.id).roleMember == 0)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Пригласивший не имеет прав приглашать");
    }
    if(dataInvtePerson.invitedFromTeam.Select(team => team.id).Contains(idTeam))
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("Пользователь уже приглашен");
    }

    dataInvtePerson.invitedFromTeam.Add(targetTeam);
    await db.SaveChangesAsync();

    return JsonConvert.SerializeObject(dataInvtePerson);

}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();

app.MapPost("api/profile/acceptInvite/{idTeam}", async delegate (HttpContext context, DBConfigurator db, int idTeam)
{
    DataUser? accountUser = Helper.FindUserFromClaim(context.User.Claims, db)?.dataUser;
    Team? team = db.Teams.Include(team => team.team_stack).Include(team => team.memberTeam).FirstOrDefault(team => team.id == idTeam);

    if (team == null || accountUser == null)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("not find team or Inveted User");
    }
    if(!accountUser.invitedFromTeam.Select(team => team.id).Contains(idTeam)) 
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("user not invited in team");
    }
    team.memberTeam.Add(new MemberTeam(accountUser, team));
    accountUser.invitedFromTeam.Remove(team);
    await db.SaveChangesAsync();

    return JsonConvert.SerializeObject(team);
}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();

app.MapPost("api/profile/cancelledInvite/{idTeam}", async delegate (HttpContext context, DBConfigurator db, int idTeam)
{
    DataUser? accountUser = Helper.FindUserFromClaim(context.User.Claims, db)?.dataUser;
    Team? team = db.Teams.Include(team => team.team_stack).Include(team => team.memberTeam).FirstOrDefault(team => team.id == idTeam);

    if (team == null || accountUser == null)
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("not find team or Inveted User");
    }
    if (!accountUser.invitedFromTeam.Select(team => team.id).Contains(idTeam))
    {
        context.Response.StatusCode = 400;
        return JsonConvert.SerializeObject("user not invited in team");
    }

    accountUser.invitedFromTeam.Remove(team);
    await db.SaveChangesAsync();

    return JsonConvert.SerializeObject(accountUser);
}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();


app.MapGet("/api/data", (HttpContext context) => $"Successfully!").RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader()).RequireAuthorization();

app.MapGet("/api/test", async delegate (HttpContext http, DBConfigurator db)
{
    return Helper.FindUserFromClaim(http.User.Claims, db);

});


app.MapPost("/api/hackathons/all", async delegate (HttpContext context, DBConfigurator db)
{

    IList<HackathonPost> posts = await db.HackathonPosts.Include(post => post.PostTags).ToListAsync();

    var configuration = context.RequestServices.GetRequiredService<IConfiguration>();

    foreach (var post in posts)
    {
        post.ImageUrl = $"{configuration["BaseUrl"]}/api/hackathons/image/{post.id}";
    }

    return Results.Ok(posts);
}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());




app.MapGet("/api/hackathons/image/{id}", async (int id, DBConfigurator db) =>
{
    var post = db.HackathonPosts.FirstOrDefault(p => p.id == id);
    if (post != null && !string.IsNullOrEmpty(post.ImageBase64))
    {
        byte[] imageBytes = Convert.FromBase64String(post.ImageBase64);
        return Results.File(imageBytes, "image/png");
    }
    else
    {
        return Results.NotFound();
    }
}).RequireCors(options => options.AllowAnyOrigin().AllowAnyHeader());




Func<DBConfigurator> dbContextFactory = () =>
{
    var optionsBuilder = new DbContextOptionsBuilder<DBConfigurator>();
    optionsBuilder.UseSqlite(connection);

    return new DBConfigurator(optionsBuilder.Options);
};


//await Helper.UpdateDatabase(dbContextFactory);


//var timer = new System.Timers.Timer(3600000); // Установка интервала в 1 час (3600000 миллисекунд)
//timer.Elapsed += async (sender, e) => await Helper.UpdateDatabase(dbContextFactory);
//timer.Start();




app.Run();