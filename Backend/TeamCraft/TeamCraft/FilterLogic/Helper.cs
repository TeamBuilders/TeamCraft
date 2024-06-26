﻿
using Microsoft.EntityFrameworkCore;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using TeamCraft.DataBaseController;
using TeamCraft.Model.Posts;
using TeamCraft.Model.UserAcrhitecture;

namespace TeamCraft.FilterLogic
{
    public static class Helper
    {

        public static int CalculateAgePerson(DateTime? birthDate)
        {
            DateTime currentDate = DateTime.Now;
            int age = currentDate.Year - birthDate.Value.Year;

            if (birthDate > currentDate.AddYears(-age))
            {
                age--;
            }

            return age;
        }


        static public string ComputeSHA512(string stringValue)
        {
            StringBuilder sb = new StringBuilder();
            using (SHA512 sha512 = SHA512.Create())
            {
                byte[] hashValue = sha512.ComputeHash(Encoding.UTF8.GetBytes(stringValue));
                foreach (byte b in hashValue)
                {
                    sb.Append($"{b:X2}");
                }
            }

            return sb.ToString();
        }

        static public bool CheckPasswordRequest(string password)
        {
            bool sizePassword = false,
                 hasUpChar = false,
                 hasDownChar = false,
                 hasNumber = CheckNumberInString(password),
                 hasSpecialChar = false;


            if (password.Any(ch => !char.IsLetterOrDigit(ch)))
                hasSpecialChar = true;
            if (password.Length >= 8)
                sizePassword = true;
            if (password.ToUpper() != password)
                hasDownChar = true;
            if (password.ToLower() != password)
                hasUpChar = true;



            return sizePassword && hasUpChar && hasDownChar && hasNumber && hasSpecialChar;
        }

        static public bool CheckCorrectPassword(string enterPassword, string hashCode)
        {
            return hashCode == ComputeSHA512(enterPassword);
        }

        static public bool CheckNumberInString(string value)
        {
            for (int i = 0; i < value.Length; i++)
                if (value[i] > 47 && value[i] < 58)
                    return true;

            return false;
        }

        static public AccountUser? FindUserFromClaim(IEnumerable<Claim> claim, DBConfigurator db)
        {
            if (claim.Count() > 0)
            {
                string loginUser = claim.ToArray()[0].Type;
                string password = claim.ToArray()[0].Value;
                return db.accountsUser.Include(data => data.dataUser).ThenInclude(data => data.skillsPerson).Include(x => x.dataUser).ThenInclude(data => data.invitedFromTeam).Include(x => x.settingsUser).FirstOrDefault(item => item.settingsUser.login == loginUser && item.settingsUser.hashPassword == ComputeSHA512(password));
            }

            return null;
        }

        /*public static async Task UpdateDatabase(Func<DBConfigurator> dbContextFactory)
        {
            using (var db = dbContextFactory())
            {
                static async Task<string> ConvertImageToBase64(string imageUrl)
                {
                    using (HttpClient httpClient = new HttpClient())
                    {
                        byte[] imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
                        return Convert.ToBase64String(imageBytes);
                    }
                }

                //"C:\Users\m1kraze\Downloads\KM76.5.3-Goanna-20240511\KM-Goanna\k-meleon.exe"

                // Установка Chromium
                var browserFetcher = new BrowserFetcher(new BrowserFetcherOptions());
                var revisionInfo = await browserFetcher.DownloadAsync("856583"); // номер последней стабильной версии Chromium

                // Получение пути к исполняемому файлу Chromium
                var executablePath = revisionInfo.GetExecutablePath();

                // Запуск браузера K-Meleon
                var browser = await Puppeteer.LaunchAsync(new LaunchOptions
                {
                    Headless = true,
                    ExecutablePath = "..\\..\\..\\..\\KM-Goanna\\k-meleon.exe" // Используем путь к исполняемому файлу K-Meleon
                });

                var page = await browser.NewPageAsync();
                //await page.GoToAsync("https://www.xn--80aa3anexr8c.xn--p1acf/");
                await page.GoToAsync("https://www.хакатоны.рус/");
                //https://www.хакатоны.рус/
                var html = await page.GetContentAsync();

                // Создание экземпляра HtmlDocument
                var htmlDocument = new HtmlAgilityPack.HtmlDocument();

                // Загрузка HTML-кода в htmlDocument
                htmlDocument.LoadHtml(html); // где html - это ваш HTML-код

                // Извлечение информации о хакатонах
                var hackathons = htmlDocument.DocumentNode.SelectNodes("//div[@class='js-feed-post']");

                if (hackathons != null)
                {
                    foreach (var hackathon in hackathons)
                    {
                        HackathonPost post = new HackathonPost();
                        post.Title = hackathon.SelectSingleNode(".//div[@class='js-feed-post-title']//a").InnerText;
                        post.Link = hackathon.SelectSingleNode(".//div[@class='js-feed-post-title']//a").GetAttributeValue("href", "");
                        post.Description = hackathon.SelectSingleNode(".//div[@class='js-feed-post-descr']").InnerText;
                        post.ImageUrl = "defaultImage.png";

                        // Проверяем, существует ли уже пост в базе данных
                        var existingPost = db.HackathonPosts.FirstOrDefault(p => p.Title == post.Title && p.Link == post.Link);

                        if (existingPost != null)
                        {
                            // Если пост уже существует, пропускаем его и переходим к следующему посту в цикле
                            continue;
                        }

                        // Если пост не существует, добавляем его в базу данных
                        db.HackathonPosts.Add(post);
                        db.SaveChanges();

                        var tags = hackathon.SelectNodes(".//div[@class='t-feed__post-tag']");


                        // Проверяем, инициализирован ли PostTags
                        if (post.PostTags == null)
                        {
                            post.PostTags = new List<PostTag>();
                        }

                        foreach (var tag in tags)
                        {
                            string tagName = tag.InnerText;
                            var existingTag = db.Tags.FirstOrDefault(t => t.nameTags == tagName);
                            if (existingTag != null)
                            {
                                // Если тег уже существует, проверяем, не был ли он уже добавлен к post
                                if (!post.PostTags.Any(pt => pt.PostsTagsId == existingTag.id))
                                {
                                    // Если тег еще не был добавлен, создаем новый PostTag
                                    var postTag = new PostTag
                                    {
                                        HackathonPostId = post.Id,
                                        PostsTagsId = existingTag.id,
                                        nameTags = existingTag.nameTags

                                    };
                                    db.PostTags.Add(postTag); // Добавляем PostTag в базу данных

                                }
                            }
                            else
                            {
                                // Если тег не существует, создаем новый тег
                                var newTag = new PostsTags { nameTags = tagName };
                                db.Tags.Add(newTag);
                                db.SaveChanges(); // Сохраняем изменения в базе данных 

                                // Создаем новый PostTag
                                var postTag = new PostTag
                                {
                                    HackathonPostId = post.Id,
                                    PostsTagsId = newTag.id,
                                    nameTags = newTag.nameTags


                                };
                                db.PostTags.Add(postTag); // Добавляем PostTag в базу данных

                            }
                            db.SaveChanges();
                        }

                        //db.SaveChanges(); // Сохраняем все изменения в базе данных

                        string imageUrl = hackathon.SelectSingleNode(".//div[@class='t-feed__post-img t-img js-feed-img']").GetAttributeValue("data-original", "");

                        if (!string.IsNullOrEmpty(imageUrl)) // Проверяем, не является ли imageUrl NULL или пустой строкой
                        {
                            string imageBase64 = await ConvertImageToBase64(imageUrl);
                            post.ImageBase64 = imageBase64;
                            post.ImageUrl = "defaultImage.png";
                        }
                        else
                        {
                            post.ImageBase64 = "defaultBase64Image"; // Задаем значение по умолчанию для ImageBase64, если imageUrl NULL или пустая строка
                            post.ImageUrl = "defaultImage.png";
                        }

                        //db.SaveChanges();

                        //posts.Add(post); // Добавляем пост в список
                    }
                }
                await db.SaveChangesAsync();

                

                // Возвращаем список постов из базы данных
                //return db.HackathonPosts.ToList();
            }


            //return Results.Ok();
            //return posts; // Возвращаем список постов
        }*/


        public static async Task UpdateDatabase(Func<DBConfigurator> dbContextFactory)
        {
            //List<HackathonPost> posts = new List<HackathonPost>();

            using (var db = dbContextFactory())
            {
                static async Task<string> ConvertImageToBase64(string imageUrl)
                {
                    using (HttpClient httpClient = new HttpClient())
                    {
                        byte[] imageBytes = await httpClient.GetByteArrayAsync(imageUrl);
                        return Convert.ToBase64String(imageBytes);
                    }
                }


                ChromeOptions options = new ChromeOptions();
                options.AddArgument("--headless");
                IWebDriver _driver = new ChromeDriver(options);
                _driver.Manage().Timeouts().PageLoad = TimeSpan.FromMinutes(1);
                _driver.Navigate().GoToUrl("https://www.xn--80aa3anexr8c.xn--p1acf/");


                Thread.Sleep(10000);


                IList<IWebElement> hackathons = _driver.FindElements(By.CssSelector(".js-feed-post"));




                foreach (var hackathon in hackathons)
                {
                    HackathonPost post = new HackathonPost();
                    post.Title = hackathon.FindElement(By.CssSelector(".js-feed-post-title a")).Text;
                    post.Link = hackathon.FindElement(By.CssSelector(".js-feed-post-title a")).GetAttribute("href");
                    post.Description = hackathon.FindElement(By.CssSelector(".js-feed-post-descr")).Text;
                    post.ImageUrl = "defaultImage.png";


                    var existingPost = db.HackathonPosts.FirstOrDefault(p => p.Title == post.Title && p.Link == post.Link);

                    if (existingPost != null)
                    {

                        continue;
                    }


                    db.HackathonPosts.Add(post);
                    db.SaveChanges();

                    IList<IWebElement> tags = hackathon.FindElements(By.CssSelector(".t-feed__post-tag"));


                    if (post.PostTags == null)
                    {
                        post.PostTags = new List<PostTag>();
                    }

                    foreach (var tag in tags)
                    {
                        string tagName = tag.Text;
                        var existingTag = db.Tags.FirstOrDefault(t => t.nameTags == tagName);
                        if (existingTag != null)
                        {

                            if (!post.PostTags.Any(pt => pt.PostsTagsId == existingTag.id))
                            {

                                var postTag = new PostTag
                                {
                                    HackathonPostId = post.id,
                                    PostsTagsId = existingTag.id,
                                    nameTags = existingTag.nameTags

                                };
                                db.PostTags.Add(postTag);

                            }
                        }
                        else
                        {

                            var newTag = new PostsTags { nameTags = tagName };
                            db.Tags.Add(newTag);
                            db.SaveChanges();


                            var postTag = new PostTag
                            {
                                HackathonPostId = post.id,
                                PostsTagsId = newTag.id,
                                nameTags = newTag.nameTags


                            };
                            db.PostTags.Add(postTag);

                        }
                        db.SaveChanges();
                    }



                    string imageUrl = hackathon.FindElement(By.CssSelector(".t-feed__post-img.t-img.js-feed-img")).GetAttribute("data-original");
                    if (!string.IsNullOrEmpty(imageUrl))
                    {
                        string imageBase64 = await ConvertImageToBase64(imageUrl);
                        post.ImageBase64 = imageBase64;
                        post.ImageUrl = "defaultImage.png";
                    }
                    else
                    {
                        post.ImageBase64 = "defaultBase64Image";
                        post.ImageUrl = "defaultImage.png";
                    }

                    //db.SaveChanges();

                    //posts.Add(post); // Добавляем пост в список
                }

                await db.SaveChangesAsync();

                _driver.Quit();


                //return db.HackathonPosts.ToList();
            }


            //return Results.Ok();
            //return posts; 
        }


        /*public static bool CheckSentence(string sentence, string[] badWords)
        {
            var russianStemmer = new RussianStemmer();
            var englishStemmer = new EnglishStemmer();
            string[] words = sentence.Split(' ', '.', ',', '!', '?');
            return !words.Any(word => badWords.Contains(russianStemmer.Stem(word), StringComparer.OrdinalIgnoreCase) || badWords.Contains(englishStemmer.Stem(word), StringComparer.OrdinalIgnoreCase));
        }*/
        public static bool CheckSentence(string sentence, string[] badWords)
        {
            string[] words = sentence.Split(' ', '.', ',', '!', '?');
            return !words.Any(word => badWords.Any(badWord => word.Contains(badWord, StringComparison.OrdinalIgnoreCase)));
        }


    }
}
