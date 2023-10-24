using Microsoft.EntityFrameworkCore;
using System;
using System.Text.Json;
using System.Text.Json.Serialization;
using TeamCraft.DataBaseController;
using TeamCraft.FilterLogic;
using TeamCraft.Model;
using TeamCraft.Model.TeamsArchitecture;
using TeamCraft.Model.UserAcrhitecture;
using Microsoft.AspNetCore.Mvc.NewtonsoftJson;

var builder = WebApplication.CreateBuilder(args);

// получаем строку подключения из файла конфигурации
string connection = builder.Configuration.GetConnectionString("DefaultConnection");

// добавляем контекст ApplicationContext в качестве сервиса в приложение
builder.Services.AddDbContext<DBConfigurator>(options => options.UseSqlServer(connection));

//builder.Services.AddMvc()
//        .AddJsonOptions(
//            options => options.JsonSerializerOptionss.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
//        );
builder.Services.AddControllers()
       .AddJsonOptions(options =>
       {
           options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
       });

var app = builder.Build();

app.MapGet("/", async delegate (HttpContext context, DBConfigurator db)
{
    //Team teamtest = new Team("TeamName", "description", "status");
    //db.Teams.Add(teamtest);

    //SettingsProfileUser settingsProfileUser = new SettingsProfileUser("superLogin", "coolPassword");
    //DataUser dataUser = new DataUser("Name", "surName", "status", new DateTime(2000, 10, 10), "test");
    //AccountUser test = new AccountUser(dataUser, settingsProfileUser);



    //db.accountsUser.Add(test);
    //MemberTeam member = new MemberTeam(dataUser);
    //db.memberTeams.Add(member);

    //teamtest.AddPersonInTeam(member);
    var t =  db.categoryHobbies.ToList()[0].skillPeople;
    return t;
    //await db.SaveChangesAsync();
    //return db.Teams.ToList();
});

app.Run();
