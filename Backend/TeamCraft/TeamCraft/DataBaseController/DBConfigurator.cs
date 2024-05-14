using Microsoft.EntityFrameworkCore;
using TeamCraft.Model.TeamsArchitecture;
using TeamCraft.Model.UserAcrhitecture;
using TeamCraft.FilterLogic;
using System.Reflection.Emit;
using TeamCraft.JwtData;
using TeamCraft.Model.Posts;

namespace TeamCraft.DataBaseController
{
    public class DBConfigurator : DbContext
    {
        public DbSet<HackathonPost> HackathonPosts { get; set; } = null!;
        public DbSet<PostsTags> Tags { get; set; } = null!;
        public DbSet<PostTag> PostTags { get; set; } = null!;
        public DbSet<DataUser> dataUser { get; set; } = null!;
        public DbSet<AccountUser> accountsUser { get; set; } = null!;
        public DbSet<SettingsProfileUser> settingsProfileUser { get; set; } = null!;
        public DbSet<MemberTeam> memberTeams { get; set; } = null!;
        public DbSet<SkillPerson> skillPeople { get; set; } = null!;
        public DbSet<CategoryHobby> categoryHobbies { get; set; } = null!;
        public DbSet<Team> Teams { get; set; } = null!;
        public DbSet<EmailData> Emails { get; set; } = null!;


        public DBConfigurator(DbContextOptions<DBConfigurator> options)
    : base(options)
        {

           // Database.EnsureDeleted();
            Database.EnsureCreated();   // создаем базу данных при первом обращени

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


        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            CategoryHobby[] listHobbies = new CategoryHobby[]
            {       
                new CategoryHobby(1,"Разработка"),
                new CategoryHobby(2,"Музыка"),
                new CategoryHobby(3,"Анимации"),
                new CategoryHobby(4,"Гейминг"),
                new CategoryHobby(5,"Социальные развлечения"),
                new CategoryHobby(6,"Научные разработки"),
                new CategoryHobby(7,"Активный отдых")
            };

            SkillPerson[] skillPeople = new SkillPerson[]
            {
                new SkillPerson(1,"C#", listHobbies[0],1),
                new SkillPerson(2,"Asp Net Core", listHobbies[0],1),
                new SkillPerson(3,"Entity FrameWrork", listHobbies[0], 1),
                new SkillPerson(4,"Html", listHobbies[0], 1),
                new SkillPerson(5,"CSS", listHobbies[0], 1),
                new SkillPerson(6,"JavaScript", listHobbies[0], 1),
                new SkillPerson(7,"git", listHobbies[0], 1),
                new SkillPerson(8,"php", listHobbies[0], 1),
                new SkillPerson(9,"C++", listHobbies[0], 1),
                new SkillPerson(10,"Python", listHobbies[0], 1),
                new SkillPerson(11,"Ruby", listHobbies[0], 1),
                new SkillPerson(12,"Swift", listHobbies[0], 1),
                new SkillPerson(13,"Kotlin", listHobbies[0], 1),
                new SkillPerson(14,"Go", listHobbies[0], 1),
                new SkillPerson(15,"Java", listHobbies[0], 1),
                new SkillPerson(16,"MySql", listHobbies[0], 1),
                new SkillPerson(17,"PostgreSQL", listHobbies[0], 1),
                new SkillPerson(18,"MongoDB", listHobbies[0], 1),
                new SkillPerson(19,"MariaDB", listHobbies[0], 1),
                new SkillPerson(20,"Unity", listHobbies[0], 1),
                new SkillPerson(21,"Unreal Engine", listHobbies[0], 1),
                new SkillPerson(22,"Godot", listHobbies[0], 1),
                new SkillPerson(23,"Unigine", listHobbies[0], 1),

                //Музыка
                new SkillPerson(24,"Композитор", listHobbies[1], 2),
                new SkillPerson(25,"Вокал", listHobbies[1],2),
                new SkillPerson(26,"Гитара", listHobbies[1],2),
                new SkillPerson(27,"Бас", listHobbies[1],2),
                new SkillPerson(28,"Клавиши", listHobbies[1],2),
                new SkillPerson(29,"Саксафон", listHobbies[1],2),
                new SkillPerson(30,"Барабаны", listHobbies[1],2),
                new SkillPerson(31,"Электронника", listHobbies[1],2)
            };

            modelBuilder.Entity<HackathonPost>()
         .Property(p => p.Id)
         .ValueGeneratedOnAdd();

            modelBuilder.Entity<PostTag>()
        .HasKey(pt => new { pt.HackathonPostId, pt.PostsTagsId });

            /*modelBuilder.Entity<HackathonPost>()
            .HasMany(p => p.Tags)
            .WithMany();*/

            modelBuilder.Entity<CategoryHobby>().HasData(listHobbies);

            modelBuilder.Entity<SkillPerson>().HasData(skillPeople);
        }
    }
}
