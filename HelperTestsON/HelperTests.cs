using TeamCraft.FilterLogic;

namespace HelperTests
{
    
    public class HelperTests
    {

        [Test]
        public void AgePersonFind1()
        {
            DateTime databirthday1 = new DateTime(2005, 12,10,0,0,0,0);

            int answer1 = 18;

            int actual1 = Helper.CalculateAgePerson(databirthday1);

            Assert.AreEqual(answer1, actual1);


            //Assert.Pass();
        }

        [Test]
        public void AgePersonFind2()
        {
            DateTime databirthday2 = new DateTime(1, 1, 1, 0, 0, 0, 0); // нулевой год нельзя поставить я так понял

            int answer2 = 2023;

            int actual2 = Helper.CalculateAgePerson(databirthday2);

            Assert.AreEqual(answer2, actual2);
        }

        [Test]
        public void CheckNumberInString_True1()
        {
            string password = "QWERTYU1";

            bool answer = true;

            bool actual = Helper.CheckNumberInString(password);

            Assert.AreEqual(answer, actual);

            
        }

        [Test]
        public void CheckNumberInString_True2()
        {
            string password = "QWER3TYU";

            bool answer = true;

            bool actual = Helper.CheckNumberInString(password);

            Assert.AreEqual(answer, actual);


        }

        [Test]
        public void CheckNumberInString_True3()
        {
            string password = "9QWERTYU";

            bool answer = true;

            bool actual = Helper.CheckNumberInString(password);

            Assert.AreEqual(answer, actual);


        }

        [Test]
        public void CheckNumberInString_False()
        {
            string password = "HQWERTYU";

            bool answer = false;

            bool actual = Helper.CheckNumberInString(password);

            Assert.AreEqual(answer, actual);


        }



        [Test]
        public void CheckPasswordRequest_True_True()
        {

            string password = "MOLLYpon12%";

            bool answer = true;

            bool actual = Helper.CheckPasswordRequest(password);

            Assert.AreEqual(answer, actual);

        }


        [Test]
        public void CheckPasswordRequest_hasSpecialChar_True()
        {

            string password = "MOLLYpon12!";

            bool answer = true;

            bool actual = Helper.CheckPasswordRequest(password);

            Assert.AreEqual(answer, actual);

        }


        [Test]
        public void CheckPasswordRequest_sizePassword_False()
        {

            string password = "MOl1%";

            bool answer = false;

            bool actual = Helper.CheckPasswordRequest(password);

            Assert.AreEqual(answer, actual);

        }

        [Test]
        public void CheckPasswordRequest_hasUpChar_False()
        {

            string password = "molly11%";

            bool answer = false;

            bool actual = Helper.CheckPasswordRequest(password);

            Assert.AreEqual(answer, actual);

        }

        [Test]
        public void CheckPasswordRequest_hasDownChar_False()
        {

            string password = "MOLLY11%";

            bool answer = false;

            bool actual = Helper.CheckPasswordRequest(password);

            Assert.AreEqual(answer, actual);

        }

        [Test]
        public void CheckPasswordRequest_hasNumber_False()
        {

            string password = "MOLLYyy%";

            bool answer = false;

            bool actual = Helper.CheckPasswordRequest(password);

            Assert.AreEqual(answer, actual);

        }

        [Test]
        public void CheckPasswordRequest_hasSpecialChar_False()
        {

            string password = "MOLLYyy9";

            bool answer = false;

            bool actual = Helper.CheckPasswordRequest(password);

            Assert.AreEqual(answer, actual);

        }


        [Test]
        public void CheckCorrectPassword_True()
        {

            string password = "MOLLYpon12%";

            string hashcode = "43c0aaa812fed02b57c30172b5bb7c5130451ce974319efecfd76394fd9ea252d3ddcbb6a85c4c08f1eacbb4961a3ddad8751e05f58ad7e4c63cc5327fd71f7d";

            hashcode = hashcode.ToUpper(); 

            bool answer = true;

            bool actual = Helper.CheckCorrectPassword(password, hashcode);

            Assert.AreEqual(answer, actual);

        }


    }
}