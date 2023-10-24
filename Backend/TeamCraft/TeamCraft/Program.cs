using Microsoft.EntityFrameworkCore;
using TeamCraft.DataBaseController;
using TeamCraft.Model;
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
    if (user == null) return Results.NotFound(new { message = "Пользователь не найден" });

    // если пользователь найден, отправляем его   
    return Results.Json(user);
});

app.MapPost("/api/users/registration/", async delegate (HttpContext context)
{
    Person user = await context.Request.ReadFromJsonAsync<Person>();
    user.Id = users.Count() - 1;
    users.Add(user);
    return user;
});

app.MapPost("/api/users/login/", async delegate (HttpContext context)
{
    
    AutorizationData user = await context.Request.ReadFromJsonAsync<AutorizationData>();
    Person usernew = users.FirstOrDefault(u => u.login == user.login && u.hashPassword==user.password);
    if (usernew == null) return Results.NotFound(new { message = "Неверный логин или пароль" });
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

app.Run();
