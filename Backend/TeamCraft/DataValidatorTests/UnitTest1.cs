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


        [Test]
        public void CheckCorrectUserData_InccorectLogin_ReturnsGoodStatus()
        {
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(200));
            Assert.That(result.statusRequest, Is.EqualTo("Ok"));
            Assert.That(result.message, Is.Empty);
        }

        [Test]
        public void CheckCorrectUserData_InccorectLogin_ReturnsBadStatus_specsymvols()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "romaniaoo",
                sureName = "nonosamay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krdr%aee",
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect login user. Size or have special symbols"));
        }

        [Test]
        public void CheckCorrectUserData_InccorectLogin_ReturnsBadStatus_shortlogin()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "romaniaoo",
                sureName = "nonosamay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1k",
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect login user. Size or have special symbols"));
        }

        [Test]
        public void CheckCorrectUserData_InccorectLogin_ReturnsBadStatus_longLogin()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "romaniaoo",
                sureName = "nonosamay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krdrddddddddddddddddddaee",
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
                login = "m1kraqeddddddddddddddddddde",
                password = "SPkleeas22#"
            });
            string connection = "Server=localhost;Database=TestDb;Trusted_Connection=True;TrustServerCertificate=true;";

            var options = new DbContextOptionsBuilder<DBConfigurator>().UseSqlServer(connection).Options;
            var db = new DBConfigurator(options);

            db.dataUser.Add(newUser1);
            db.dataUser.Add(newUser2);
            db.SaveChanges();

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect login user. Size or have special symbols"));
        }


        [Test]
        public void CheckCorrectUserData_InccorectPassword_ReturnsGOODStatus()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "romaniaoo",
                sureName = "nonosamay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krareze",
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(200));
            Assert.That(result.statusRequest, Is.EqualTo("Ok"));
            Assert.That(result.message, Is.Empty);
        }

        [Test]
        public void CheckCorrectUserData_InccorectPassword_ReturnsBadStatus_noSpecSymvols()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "romaniaoo",
                sureName = "nonosamay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krareze",
                password = "SParkle228"
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect password: length, no number or special symbols"));
        }


        [Test]
        public void CheckCorrectUserData_InccorectPassword_ReturnsBadStatus_shortPassword()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "romaniaoo",
                sureName = "nonosamay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krareze",
                password = "SPa228#"
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect password: length, no number or special symbols"));
        }

        [Test]
        public void CheckCorrectUserData_InccorectPassword_ReturnsBadStatus_noCAPS()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "romaniaoo",
                sureName = "nonosamay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krareze",
                password = "sparkle228#"
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect password: length, no number or special symbols"));
        }

        [Test]
        public void CheckCorrectUserData_InccorectPassword_ReturnsBadStatus_noSmallWords()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "romaniaoo",
                sureName = "nonosamay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krareze",
                password = "SPARKLE228#"
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect password: length, no number or special symbols"));
        }

        [Test]
        public void CheckCorrectUserData_InccorectNameUser_ReturnsBadStatus_shortName()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "r",
                sureName = "nonosamay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krareze",
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect name user. Size or have special symbols or numbers"));
        }

        [Test]
        public void CheckCorrectUserData_InccorectNameUser_ReturnsBadStatus_longName()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "rrrrrrrkkkkkkkkkk",
                sureName = "nonosamay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krareze",
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect name user. Size or have special symbols or numbers"));
        }


        [Test]
        public void CheckCorrectUserData_InccorectNameUser_ReturnsBadStatus_HaveSpecSymvols()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "rr###%%%k",
                sureName = "nonosamay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krareze",
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect name user. Size or have special symbols or numbers"));
        }

        [Test]
        public void CheckCorrectUserData_InccorectNameUser_ReturnsBadStatus_HaveNumbers()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "rr12412k",
                sureName = "nonosamay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krareze",
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect name user. Size or have special symbols or numbers"));
        }


        [Test]
        public void CheckCorrectUserData_InccorectSurnameUser_ReturnsBadStatus_shortName()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "roman",
                sureName = "n",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krareze",
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect surname user. Size or have special symbols or numbers"));
        }

        [Test]
        public void CheckCorrectUserData_InccorectSurNameUser_ReturnsBadStatus_longName()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "roman",
                sureName = "nonosfffffffffffffffffffffamay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krareze",
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect surname user. Size or have special symbols or numbers"));
        }


        [Test]
        public void CheckCorrectUserData_InccorectSurNameUser_ReturnsBadStatus_HaveSpecSymvols()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "roman",
                sureName = "nonos#%$amay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krareze",
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect surname user. Size or have special symbols or numbers"));
        }

        [Test]
        public void CheckCorrectUserData_InccorectSurNameUser_ReturnsBadStatus_HaveNumbers()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "roman",
                sureName = "non14a6436may",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krareze",
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect surname user. Size or have special symbols or numbers"));
        }


        //InccorectBirthday
        [Test]
        public void CheckCorrectUserData_InccorectBirthday_ReturnsBadStatus_short()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "roman",
                sureName = "nonoomay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(2020, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krareze",
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Юзер либо еще не родился, либо уже умер, в любом случае все по новой"));
        }

        [Test]
        public void CheckCorrectUserData_InccorectBirthday_ReturnsBadStatus_crowded100()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "roman",
                sureName = "nonoomay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1700, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1krareze",
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

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Юзер либо еще не родился, либо уже умер, в любом случае все по новой"));
        }




        [Test]
        public void CheckCorrectUserData_ThisLoginAlreadyExist_ReturnsBadStatus()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "roman",
                sureName = "nonoomay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1kraqee",
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

            var newUser2_reg = new RegistrationForm
            {
                login = "m1kraqee",
                password = "SPkleeas22#"
            };
            var newUser2_reg_settings = new SettingsProfileUser(newUser2_reg);

            db.dataUser.Add(newUser1);
            db.settingsProfileUser.Add(newUser2_reg_settings);
            db.dataUser.Add(newUser2);
            db.SaveChanges();

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectUserData(unverifiedUser, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Такой логин уже есть"));
        }

        [Test]
        public static void CheckCorrectLoginData_InccorectLoginForm_AllNull()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "roman",
                sureName = "nonoomay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1kraqeeee",
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

            var newUser2_reg = new RegistrationForm
            {
                login = "m1kraqee",
                password = "SPkleeas22#"
            };
            var newUser2_reg_settings = new SettingsProfileUser(newUser2_reg);

            var Login1 = new LoginForm
            {
                login = null,
                password = null
            };
            /*
             var Login1 = new LoginForm{
                login = "m1kraqee",
                password = "SPkleeas22#" };*/

            db.dataUser.Add(newUser1);
            db.settingsProfileUser.Add(newUser2_reg_settings);
            db.dataUser.Add(newUser2);
            db.SaveChanges();

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectLoginData(Login1, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("loginForm = null or Not all required fields are filled in!"));
        }

        [Test]
        public static void CheckCorrectLoginData_InccorectLoginForm_LoginNull()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "roman",
                sureName = "nonoomay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1kraqeeee",
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

            var newUser2_reg = new RegistrationForm
            {
                login = "m1kraqee",
                password = "SPkleeas22#"
            };
            var newUser2_reg_settings = new SettingsProfileUser(newUser2_reg);

            var Login1 = new LoginForm
            {
                login = null,
                password = "SPkleeas22#"
            };
            /*
             var Login1 = new LoginForm{
                login = "m1kraqee",
                password = "SPkleeas22#" };*/

            db.dataUser.Add(newUser1);
            db.settingsProfileUser.Add(newUser2_reg_settings);
            db.dataUser.Add(newUser2);
            db.SaveChanges();

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectLoginData(Login1, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("loginForm = null or Not all required fields are filled in!"));

        }

        [Test]
        public static void CheckCorrectLoginData_InccorectLoginForm_PasswordNull()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "roman",
                sureName = "nonoomay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1kraqeeee",
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

            var newUser2_reg = new RegistrationForm
            {
                login = "m1kraqee",
                password = "SPkleeas22#"
            };
            var newUser2_reg_settings = new SettingsProfileUser(newUser2_reg);

            var Login1 = new LoginForm
            {
                login = "m1kraqee",
                password = null
            };
            /*
             var Login1 = new LoginForm{
                login = "m1kraqee",
                password = "SPkleeas22#" };*/

            db.dataUser.Add(newUser1);
            db.settingsProfileUser.Add(newUser2_reg_settings);
            db.dataUser.Add(newUser2);
            db.SaveChanges();

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectLoginData(Login1, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("loginForm = null or Not all required fields are filled in!"));

        }



        [Test]
        public static void CheckCorrectLoginData_InccorectLoginForm_InccorectPassword()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "roman",
                sureName = "nonoomay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1kraqeeee",
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

            /*var newUser2 = new DataUser(new RegistrationForm
            {
                name = "romanfoo",
                sureName = "nondfay",
                description = "natadl",
                gender = "male",
                birthday = new DateTime(1990, 5, 15),
                contact = "romadae141@gmail.com",
                login = "m1kraqee",
                password = "SPkleeas22#"
            });*/
            string connection = "Server=localhost;Database=TestDb;Trusted_Connection=True;TrustServerCertificate=true;";

            var options = new DbContextOptionsBuilder<DBConfigurator>().UseSqlServer(connection).Options;
            var db = new DBConfigurator(options);

            var newUser2_reg = new RegistrationForm
            {
                name = "romanfoo",
                sureName = "nondfay",
                description = "natadl",
                gender = "male",
                birthday = new DateTime(1990, 5, 15),
                contact = "romadae141@gmail.com",
                login = "m1kraqee",
                password = "SPkleeas22#"
            };
            var newUser2_reg_settings = new SettingsProfileUser(newUser2_reg);

            var account1 = new AccountUser(newUser2_reg);



            var Login1 = new LoginForm
            {
                login = "m1kraqee",
                password = "SPkleeas22#1"
            };
            /*
             var Login1 = new LoginForm{
                login = "m1kraqee",
                password = "SPkleeas22#" };*/

            db.dataUser.Add(newUser1);
            db.settingsProfileUser.Add(newUser2_reg_settings);
            db.accountsUser.Add(account1);
            db.SaveChanges();

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectLoginData(Login1, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect password or login"));

        }

        [Test]
        public static void CheckCorrectLoginData_InccorectLoginForm_InccorectLogin()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "roman",
                sureName = "nonoomay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1kraqeeee",
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

            /*var newUser2 = new DataUser(new RegistrationForm
            {
                name = "romanfoo",
                sureName = "nondfay",
                description = "natadl",
                gender = "male",
                birthday = new DateTime(1990, 5, 15),
                contact = "romadae141@gmail.com",
                login = "m1kraqee",
                password = "SPkleeas22#"
            });*/
            string connection = "Server=localhost;Database=TestDb;Trusted_Connection=True;TrustServerCertificate=true;";

            var options = new DbContextOptionsBuilder<DBConfigurator>().UseSqlServer(connection).Options;
            var db = new DBConfigurator(options);

            var newUser2_reg = new RegistrationForm
            {
                name = "romanfoo",
                sureName = "nondfay",
                description = "natadl",
                gender = "male",
                birthday = new DateTime(1990, 5, 15),
                contact = "romadae141@gmail.com",
                login = "m1kraqee",
                password = "SPkleeas22#"
            };
            var newUser2_reg_settings = new SettingsProfileUser(newUser2_reg);

            var account1 = new AccountUser(newUser2_reg);



            var Login1 = new LoginForm
            {
                login = "m1kraqee1",
                password = "SPkleeas22#"
            };
            /*
             var Login1 = new LoginForm{
                login = "m1kraqee",
                password = "SPkleeas22#" };*/

            db.dataUser.Add(newUser1);
            db.settingsProfileUser.Add(newUser2_reg_settings);
            db.accountsUser.Add(account1);
            db.SaveChanges();

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectLoginData(Login1, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(400));
            Assert.That(result.statusRequest, Is.EqualTo("error"));
            Assert.That(result.message, Contains.Item("Inccorect password or login"));

        }


        [Test]
        public static void CheckCorrectLoginData_InccorectLoginForm_Correct()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "roman",
                sureName = "nonoomay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "m1kraqeeee",
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

            /*var newUser2 = new DataUser(new RegistrationForm
            {
                name = "romanfoo",
                sureName = "nondfay",
                description = "natadl",
                gender = "male",
                birthday = new DateTime(1990, 5, 15),
                contact = "romadae141@gmail.com",
                login = "m1kraqee",
                password = "SPkleeas22#"
            });*/
            string connection = "Server=localhost;Database=TestDb;Trusted_Connection=True;TrustServerCertificate=true;";

            var options = new DbContextOptionsBuilder<DBConfigurator>().UseSqlServer(connection).Options;
            var db = new DBConfigurator(options);

            var newUser2_reg = new RegistrationForm
            {
                name = "romanfoo",
                sureName = "nondfay",
                description = "natadl",
                gender = "male",
                birthday = new DateTime(1990, 5, 15),
                contact = "romadae141@gmail.com",
                login = "m1kraqee",
                password = "SPkleeas22#"
            };
            var newUser2_reg_settings = new SettingsProfileUser(newUser2_reg);

            var account1 = new AccountUser(newUser2_reg);



            var Login1 = new LoginForm
            {
                login = "m1kraqee",
                password = "SPkleeas22#"
            };
            /*
             var Login1 = new LoginForm{
                login = "m1kraqee",
                password = "SPkleeas22#" };*/

            db.dataUser.Add(newUser1);
            db.settingsProfileUser.Add(newUser2_reg_settings);
            db.accountsUser.Add(account1);
            db.SaveChanges();

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectLoginData(Login1, db);

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(200));
            Assert.That(result.statusRequest, Is.EqualTo("Ok"));
            Assert.That(result.message, Contains.Item("Correct data"));

        }


        [Test]
        public static void BagPoiskPolzovatelyaVoobshePipec()
        {
            var unverifiedUser = new RegistrationForm
            {
                name = "aromanio",
                sureName = "nonoomay",
                description = "natudaral",
                gender = "male",
                birthday = new DateTime(1980, 5, 15),
                contact = "romaa143321@gmail.com",
                login = "am1krazeee",
                password = "SPArkle228#"
            };

            var newUser1 = new RegistrationForm
            {
                name = "bromanio",
                sureName = "nonomay",
                description = "natural",
                gender = "male",
                birthday = new DateTime(1990, 5, 15),
                contact = "roma141@gmail.com",
                login = "bm1krazeee",
                password = "SPArkle228#"
            };

            string connection = "Server=localhost;Database=TestDb;Trusted_Connection=True;TrustServerCertificate=true;";

            var options = new DbContextOptionsBuilder<DBConfigurator>().UseSqlServer(connection).Options;
            var db = new DBConfigurator(options);

            var newUser2_reg = new RegistrationForm
            {
                name = "romanfoo",
                sureName = "nondfay",
                description = "natadl",
                gender = "male",
                birthday = new DateTime(1990, 5, 15),
                contact = "romadae141@gmail.com",
                login = "m1kraqee",
                password = "SPkleeas22#"
            };

            var newUser2_reg_settings = new SettingsProfileUser(newUser2_reg);
            var account1 = new AccountUser(newUser2_reg);

            var newUser3_reg_settings = new SettingsProfileUser(unverifiedUser);
            var account2 = new AccountUser(unverifiedUser);

            var newUser4_reg_settings = new SettingsProfileUser(newUser1);
            var account3 = new AccountUser(newUser1);

            var Login1 = new LoginForm   // && users.settingsUser.login == loginForm.login
            {
                login = "am1krazeee", 
                password = "SPArkle228#"
            };
            /*
             var Login1 = new LoginForm{
                login = "m1kraqee",
                password = "SPkleeas22#" };*/

            //db.dataUser.Add(newUser1);
            db.settingsProfileUser.Add(newUser4_reg_settings);
            db.accountsUser.Add(account3);
            db.settingsProfileUser.Add(newUser2_reg_settings);
            db.accountsUser.Add(account1);
            db.settingsProfileUser.Add(newUser3_reg_settings);
            db.accountsUser.Add(account2);
            db.SaveChanges();

            var result = TeamCraft.FilterLogic.DataValidator.CheckCorrectLoginData(Login1, db); //bm1krazeee 

            // Assert
            Assert.That(result.statusCode, Is.EqualTo(200));
            Assert.That(result.statusRequest, Is.EqualTo("Ok"));
            Assert.That(result.message, Contains.Item("Correct data"));

        }

    }
}