using Mapping;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Config
{
    public static class RabbitmqBuilder
    {
        public static void AddRabbitmqSettings(this IServiceCollection services, IConfiguration config)
        {
            var hostname = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqHost);
            var username = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqUsername);
            var password = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqPassword);

            var mailQueue = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqMailQueue);
            var mailExchange = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqMailExchange);
            var mailRoutingKey = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqMailRoutingKey);

            var categoryDiscountQueue = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqCategoryDiscountQueue);
            var categoryDiscountExchange = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqCategoryDiscountExchange);
            var categoryDiscountRoutingkey = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqCategoryDiscountRoutingkey);

            var categoryPromotionQueue = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqCategoryPromotionQueue);
            var categoryPromotionExchange = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqCategoryPromotionExchange);
            var categoryPromotionRoutingkey = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqCategoryPromotionRoutingkey);

            services.AddSingleton<IRabbimqSettings>(new RabbimqSettings()
            {
                Host = hostname,
                Username = username,
                Password = password,
                MailQueue = mailQueue,
                Exchange = mailExchange,
                RoutingKey = mailRoutingKey,
                CategoryDiscountQueue = categoryDiscountQueue,
                CategoryDiscountExchange = categoryDiscountExchange,
                CategoryDiscountRoutingkey = categoryDiscountRoutingkey,
                CategoryPromotionQueue = categoryPromotionQueue,
                CategoryPromotionExchange = categoryPromotionExchange,
                CategoryPromotionRoutingkey = categoryPromotionRoutingkey,
            });
        }
    }
}
