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
            var fullHostName = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqFullHost);

            var orderStateChangedQueue = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqOrderStateChangedQueue);
            var orderStateChangedQueueName = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqOrderStateChangedQueueName);

            var orderCreatedQueue = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqOrderCreatedQueue);
            var orderCreatedExchange = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqOrderCreatedExchange);
            var orderCreatedRoutingkey = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqOrderCreatedRoutingkey);

            services.AddSingleton<IRabbimqSettings>(new RabbimqSettings()
            {
                Host = hostname,
                Username = username,
                Password = password,
                FullHost = fullHostName,
                OrderStateChangedQueue = orderStateChangedQueue,
                OrderStateChangedQueueName = orderStateChangedQueueName,
                OrderCreatedQueue = orderCreatedQueue,
                OrderCreatedExchange = orderCreatedExchange,
                OrderCreatedRoutingkey = orderCreatedRoutingkey,
            });
        }
    }
}
