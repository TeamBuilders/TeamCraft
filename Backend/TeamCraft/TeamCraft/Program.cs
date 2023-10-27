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
using System.Linq;

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
    //var t =  db.categoryHobbies.ToList()[0].skillPeople;
    //return t;



    //1

    /*var users = db.dataUser.Where(p => EF.Functions.Like(p.name!, "Гена"));
    return users.ToList();*/



    //2


    /*var users = db.dataUser.Where(u => u.age >= 18)
        .Intersect(db.dataUser.Where(u => u.name!.Contains("Гена")));
    return users.ToList();*/

    // var users = db.dataUser.ToList();


    //3

    /*var users =  db.dataUser.ToList();
    //db.dataUser.Where(u => u.age > 0)
        //.ExecuteUpdate(s => s.SetProperty(u => u.age, u => u.age + 1)); // ТУТ я хотел заюзать это, но у меня что-то нихера не вышло и я решил юзать Foreach
    //db.SaveChanges();
    foreach (var user in users)
    {
        user.age += 1; // Увеличиваем возраст каждого пользователя на 1
    }
    db.SaveChanges();
    return users.ToList();*/




    //4
    /*var userMaxSkills = db.dataUser.OrderByDescending(u => u.skillsPerson.Count)
    .FirstOrDefault();

    var userToDelete = db.dataUser.Where(u => u.Id != userMaxSkills.Id)
    .ToList();

    db.dataUser.RemoveRange(userToDelete);
    db.SaveChanges();
    return db.dataUser.ToList();*/



    //5
    /*var requiredSkills = new List<string> { "C#", "Asp Net Core", "Unity" };

    var users = db.dataUser
        .Where(u => u.skillsPerson.Any(s => requiredSkills.Contains(s.nameSkill)))
        .OrderByDescending(u => u.skillsPerson.Count(s => requiredSkills.Contains(s.nameSkill))).FirstOrDefault();
    return users;*/

    // Нахождение пользователя с наиболее подходящими навыками
    



    /*var dataUsers = db.dataUser.Where(u => EF.Functions.Like(u.age.ToString(), "2%"));
    return dataUsers.ToList();*/


    //var t = db.dataUser.ToList();
    //return t;
    //await db.SaveChangesAsync();
    //return db.Teams.ToList();
});

app.Run();
