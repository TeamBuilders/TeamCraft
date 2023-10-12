using Microsoft.EntityFrameworkCore;
using TeamCraft.DataBaseController;
using TeamCraft.Model;

var builder = WebApplication.CreateBuilder(args);

// �������� ������ ����������� �� ����� ������������
string connection = builder.Configuration.GetConnectionString("DefaultConnection");

// ��������� �������� ApplicationContext � �������� ������� � ����������
builder.Services.AddDbContext<DBConfigurator>(options => options.UseSqlServer(connection));

var app = builder.Build();

app.MapGet("/", async delegate (HttpContext context, DBConfigurator db)
{
    //CategoryHobby test = new CategoryHobby() {  nameHobby = "test"};
    //await db.categoryHobbies.AddAsync(test);
    //await db.SaveChangesAsync();
    //return db.categoryHobbies.ToList();


    /*Person person = new Person() { nickName = "Pon", gender = "natural", urlContact = "vfksgk" };
    Team team = new Team() { teamName = "GAVNO", teamDescription = "fsfhketomrjg", teamGoal = "fsghrhktj" };
    team.people = new List<Person>() { person };

    db.people.Add(person);
    db.Teams.Add(team);
    db.SaveChanges();
    return db.Teams.ToList();*/


    //return db.people.ToList();

    //var coord = db.Coordinate.ToList();
    //return db.Users.ToList();
});

app.Run();
