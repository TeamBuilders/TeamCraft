using Microsoft.EntityFrameworkCore;
using System;
using System.Text.Json.Serialization;
using TeamCraft.DataBaseController;
using TeamCraft.FilterLogic;
using TeamCraft.Model;
using TeamCraft.Model.TeamsArchitecture;
using TeamCraft.Model.UserAcrhitecture;
using System.Net.Mail;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

string connection = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<DBConfigurator>(options => options.UseSqlServer(connection));

builder.Services.AddControllers()
       .AddJsonOptions(options =>
       {
           options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
       });

var app = builder.Build();


app.MapPost("/api/profile/restoration/", async delegate (HttpContext context)
{
    EmailData email = await context.Request.ReadFromJsonAsync<EmailData>();
    // �������� ������
    // ��������� SMTP-������� Mail.ru
    string smtpServer = "smtp.mail.ru";
    int smtpPort = 587;
    string smtpUsername = "proverka_2121@mail.ru"; //���� �����, � ������� ������������ ���������
    string smtpPassword = "iRzNgtp4J8UKaT515daf";//������ ���������� (�� �����)

    // ������� ������ ������� SMTP
    using (SmtpClient smtpClient = new SmtpClient(smtpServer, smtpPort))
    {
        // ��������� ��������������
        smtpClient.Credentials = new NetworkCredential(smtpUsername, smtpPassword);
        smtpClient.EnableSsl = true;

        using (MailMessage mailMessage = new MailMessage())
        {
            mailMessage.From = new MailAddress(smtpUsername);
            mailMessage.To.Add(email.email); // ������� ����� ����������
            mailMessage.Subject = "��������� ��������� (����)";
            mailMessage.Body = $"����� ���������";

            try
            {
                // ���������� ���������
                smtpClient.Send(mailMessage);
                Console.WriteLine("��������� ������� ����������.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"������ �������� ���������: {ex.Message}");
            }
        }
    }
});


app.Run();
