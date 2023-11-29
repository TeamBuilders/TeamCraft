using Microsoft.EntityFrameworkCore;
using System;
using System.Text.Json.Serialization;
using TeamCraft.DataBaseController;
using TeamCraft.FilterLogic;
using TeamCraft.Model.TeamsArchitecture;
using TeamCraft.Model.UserAcrhitecture;
using System.Net.Mail;
using System.Net;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using TeamCraft.JwtData;

var builder = WebApplication.CreateBuilder(args);

string connection = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<DBConfigurator>(options => options.UseSqlServer(connection));

builder.Services.AddControllers()
       .AddJsonOptions(options =>
       {
           options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
       });

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            // ���������, ����� �� �������������� �������� ��� ��������� ������
            ValidateIssuer = true,
            // ������, �������������� ��������
            ValidIssuer = AuthOptions.ISSUER,
            // ����� �� �������������� ����������� ������
            ValidateAudience = true,
            // ��������� ����������� ������
            ValidAudience = AuthOptions.AUDIENCE,
            // ����� �� �������������� ����� �������������
            ValidateLifetime = false,
            // ��������� ����� ������������
            IssuerSigningKey = AuthOptions.GetSymmetricSecurityKey(),
            // ��������� ����� ������������
            ValidateIssuerSigningKey = true,
        };
    });
var app = builder.Build();




app.MapPost("/api/profile/restoration/", async delegate (HttpContext context)
{
    Random random = new Random();
    int randomNumber = random.Next(1000, 10000);
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
            mailMessage.Body = $"���:{randomNumber}";

            try
            {
                // ���������� ���������
                smtpClient.Send(mailMessage);
                Console.WriteLine("��������� ������� ����������.");
                return Results.Json(randomNumber);


            }
            catch (Exception ex)
            {
                Console.WriteLine($"������ �������� ���������: {ex.Message}");
                return Results.Json("������");
            }
        }
    }
});

app.Run();
