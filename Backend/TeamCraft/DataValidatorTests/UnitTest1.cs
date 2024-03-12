using NUnit.Framework;
using TeamCraft.DataBaseController;
using TeamCraft.FilterLogic;
using TeamCraft.JsonParsersClasses;
using Microsoft.EntityFrameworkCore;
using TeamCraft.Model.UserAcrhitecture;
using System.Reflection;
using TeamCraft.Model;
using System.Data;
using Microsoft.EntityFrameworkCore.Storage;

namespace DataValidator.Tests
{
    public class Tests
    {

        /*[SetUp]
        public static void Setup()
        {
            
            var newUser = new DataUser(new RegistrationForm
            {
                name = "рома",
                sureName = "огоговый",
                description = "существую",
                gender = "male",
                birthday = new DateTime(1990, 5, 15),
                contact = "roma141@gmail.com"
            });
            var options = new DbContextOptionsBuilder<DBConfigurator>()
    .UseSqlServer("MSSQLLocalDB")
    .Options;
            var db = new DBConfigurator(options);   
            db.dataUser.Add(newUser);
            db.SaveChanges();
        }*/
        




        /*[SetUp]
        public static void Setupp()
        {
            var newUser = new DataUser(new RegistrationForm
            {
                name = "редис",
                sureName = "красный",
                description = "существую",
                gender = "male",
                birthday = new DateTime(1990, 5, 15),
                contact = "roma141@gmail.com"
            });
            var options = new DbContextOptionsBuilder<DBConfigurator>().Options;

            var db = new DBConfigurator(options);
            db.dataUser.Add(newUser);
            db.SaveChanges();
        }*/

        [Test]
        public void CheckCorrectUserData_NullUser_ReturnsBadStatus()
        {

            RegistrationForm? unverifiedUser = null;
            var newUser = new DataUser(new RegistrationForm
            {
                name = "редис",
                sureName = "красный",
                description = "существую",
                gender = "male",
                birthday = new DateTime(1990, 5, 15),
                contact = "roma141@gmail.com"
            });

            DBConfigurator db = null;

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db); 
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("User = null"));
        }


        [Test]
        public void CheckCorrectUserData_MissingRequiredFields_ReturnsGoodStatus()
        {
            // Arrange
            //RegistrationForm? unverifiedUser = null;
            
            var unverifiedUser = new RegistrationForm
            {
                name = "romaniaoo",
                sureName = "nonosamay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krdraee",
                password = "SParkle228#"
            };

            var newUser1 = new DataUser(new RegistrationForm
            {
                name = "romanioo",
                sureName = "nonomay",
                description = "natural",
                gender = "male",
                birthday = new DateTime(1990, 5, 15),
                contact = "roma141@gmail.com",
                login = "m1krazeee",
                password = "SPArkle228#"
            });

            var newUser2 = new DataUser(new RegistrationForm
            {
                name = "romanfoo",
                sureName = "nondfay",
                description = "natadl",
                gender = "male",
                birthday = new DateTime(1990, 5, 15),
                contact = "romadae141@gmail.com",
                login = "m1kraqee",
                password = "SPkleeas22#"
            });
            string connection = "Server=localhost;Database=TestDb;Trusted_Connection=True;TrustServerCertificate=true;";

            var options = new DbContextOptionsBuilder<DBConfigurator>().UseSqlServer(connection).Options;
            var db = new DBConfigurator(options);
            
            db.dataUser.Add(newUser1);
            db.dataUser.Add(newUser2);
            db.SaveChanges();



            // Act
            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(200));
            Assert.That(result.statusRequest, Is.EqualTo("Ok"));
            Assert.That(result.message, Is.Empty);
        }




        [Test]
        public void CheckCorrectUserData_MissingRequiredFields_ReturnsBadStatus2()
        {
            // Arrange
            RegistrationForm? unverifiedUser = null;
            var newUser = new RegistrationForm
            {
                name = null,
                sureName = null,
                description = null,
                gender = null,
                birthday = null,
                contact = null,
                login = null,
                password = null
            };

            DBConfigurator db = null;

            // Act
            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(newUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Not all required fields are filled in!"));
        }








    }
}