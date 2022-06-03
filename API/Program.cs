using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API
{
    public class Program
    {
        public static async Task Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            using var scope = host.Services.CreateScope();
            var serviceProvider = scope.ServiceProvider;

            try
            {
                var context = serviceProvider.GetRequiredService<DataContext>();
                var userManager = serviceProvider.GetRequiredService<UserManager<AppUser>>();
                await context.Database.MigrateAsync();
                await Seed.SeedData(context, userManager);
            }
            catch (System.Exception ex)
            {
                var logger = serviceProvider.GetRequiredService<ILogger<Program>>();
                logger.LogError(ex, "An error occured during db migration.");
            }

            await host.RunAsync();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
