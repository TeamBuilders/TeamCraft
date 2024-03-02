using Microsoft.EntityFrameworkCore;
using TeamCraft.Model.TeamsArchitecture;
using TeamCraft.Model.UserAcrhitecture;
using TeamCraft.FilterLogic;
using System.Reflection.Emit;

namespace TeamCraft.DataBaseController
{
    public class DBConfigurator : DbContext
    {
        public DbSet<DataUser> dataUser { get; set; } = null!;
        public DbSet<AccountUser> accountsUser { get; set; } = null!;
        public DbSet<SettingsProfileUser> settingsProfileUser { get; set; } = null!;
        public DbSet<MemberTeam> memberTeams { get; set; } = null!;
        public DbSet<SkillPerson> skillPeople { get; set; } = null!;
        public DbSet<CategoryHobby> categoryHobbies { get; set; } = null!;
        public DbSet<Team> Teams { get; set; } = null!;

        public DBConfigurator(DbContextOptions<DBConfigurator> options)
            : base(options)
        {
            Database.EnsureDeleted();
            Database.EnsureCreated();   // создаем базу данных при первом обращении
            CategoryHobby[] listHobbies = new CategoryHobby[]
            {       new CategoryHobby("Разработка"),
                    new CategoryHobby("Музыка"),
                    new CategoryHobby("Анимации"),
                    new CategoryHobby("Гейминг"),
                    new CategoryHobby("Социальные развлечения"),
                    new CategoryHobby("Научные разработки"),
                    new CategoryHobby("Активный отдых")
            };
            this.categoryHobbies.AddRange(listHobbies);

            this.skillPeople.AddRange(
             //Разработка
             new SkillPerson("C#", listHobbies[0]),
             new SkillPerson("Asp Net Core", listHobbies[0]),
             new SkillPerson("Entity FrameWrork", listHobbies[0]),
             new SkillPerson("Html", listHobbies[0]),
             new SkillPerson("CSS", listHobbies[0]),
            new SkillPerson("JavaScript", listHobbies[0]),
            new SkillPerson("git", listHobbies[0]),
            new SkillPerson("php", listHobbies[0]),
            new SkillPerson("C++", listHobbies[0]),
            new SkillPerson("Python", listHobbies[0]),
            new SkillPerson("Ruby", listHobbies[0]),
            new SkillPerson("Swift", listHobbies[0]),
            new SkillPerson("Kotlin", listHobbies[0]),
            new SkillPerson("Go", listHobbies[0]),
            new SkillPerson("Java", listHobbies[0]),
            new SkillPerson("MySql", listHobbies[0]),
            new SkillPerson("PostgreSQL", listHobbies[0]),
            new SkillPerson("MongoDB", listHobbies[0]),
            new SkillPerson("MariaDB", listHobbies[0]),
            new SkillPerson("Unity", listHobbies[0]),
            new SkillPerson("Unreal Engine", listHobbies[0]),
            new SkillPerson("Godot", listHobbies[0]),
            new SkillPerson("Unigine", listHobbies[0]),

            //Музыка
            new SkillPerson("Композитор", listHobbies[1]),
            new SkillPerson("Вокал", listHobbies[1]),
            new SkillPerson("Гитара", listHobbies[1]),
            new SkillPerson("Бас", listHobbies[1]),
            new SkillPerson("Клавиши", listHobbies[1]),
            new SkillPerson("Саксафон", listHobbies[1]),
            new SkillPerson("Барабаны", listHobbies[1]),
            new SkillPerson("Электронника", listHobbies[1]));
            this.SaveChanges();
        }
    }
}
