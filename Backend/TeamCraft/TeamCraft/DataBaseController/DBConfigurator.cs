using Microsoft.EntityFrameworkCore;
using TeamCraft.Model;

namespace TeamCraft.DataBaseController
{
    public class DBConfigurator : DbContext
    {
        public DbSet<Person> people { get; set; } = null!;
        public DbSet<SkillPerson> skillPeople { get; set; } = null!;
        public DbSet<CategoryHobby> categoryHobbies { get; set; } = null!;

        public DBConfigurator(DbContextOptions<DBConfigurator> options)
            : base(options)
        {
            Database.EnsureDeleted();
            Database.EnsureCreated();   // создаем базу данных при первом обращении
        }
    }
}
