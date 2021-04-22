using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Config;

namespace Web.Cache
{
    public static class CartsCacheBuilder
    {
        public static void AddCartsCache(this IServiceCollection services, IConfiguration config)
        {
            configureRedis(services, config);

            var sp = services.BuildServiceProvider();
            var settings = sp.GetService<IRedisSettings>();

            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = settings.Url;
                options.InstanceName = settings.CartsInstance;
            });

            services.AddTransient<CartsCache>();
        }

        private static void configureRedis(IServiceCollection services, IConfiguration config)
        {
            services.Configure<RedisSettings>(config.GetSection(nameof(RedisSettings)));

            services.AddSingleton<IRedisSettings>(sp => sp.GetRequiredService<IOptions<RedisSettings>>().Value);
        }
    }
}
