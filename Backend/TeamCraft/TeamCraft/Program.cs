using Microsoft.EntityFrameworkCore;
using TeamCraft.DataBaseController;
using TeamCraft.Model;
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
    if (user == null) return Results.NotFound(new { message = "������������ �� ������" });

    // ���� ������������ ������, ���������� ���   
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
    Person usern = users.FirstOrDefault(u => u.login == user.login && u.hashPassword==user.password);
    if (usern == null) return Results.NotFound(new { message = "�������� ����� ��� ������" });
    return Results.Json(usern);
});

app.MapPut("/api/users/change", async delegate (HttpContext context)
{

    Person user = await context.Request.ReadFromJsonAsync<Person>();
    Person usern = users.FirstOrDefault(u => u.Id == user.Id && u.hashPassword == user.hashPassword);
    if (usern == null) return Results.NotFound(new { message = "�������� ������" });
    usern.name = user.name;
    usern.sureName = user.sureName;
    usern.hashPassword = user.hashPassword;
    usern.skillsPerson = user.skillsPerson;
    usern.urlContact = user.urlContact;
    usern.hobbiesPerson = user.hobbiesPerson;
    usern.login = user.login;
    usern.databirthday = user.databirthday;
    usern.gender = user.gender;
    return Results.Json(usern);
});

app.Run();
