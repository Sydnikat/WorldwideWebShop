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

            var invoiceCreatedQueue = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqInvoiceCreatedQueue);
            var invoiceCreatedExchange = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqInvoiceCreatedExchange);
            var invoiceCreatedRoutingkey = Environment.GetEnvironmentVariable(EnvironmentVariables.RabbimqInvoiceCreatedRoutingkey);

            services.AddSingleton<IRabbimqSettings>(new RabbimqSettings()
            {
                Host = hostname,
                Username = username,
                Password = password,
                FullHost = fullHostName,
                OrderStateChangedQueue = orderStateChangedQueue,
                InvoiceCreatedQueue = invoiceCreatedQueue,
                InvoiceCreatedExchange = invoiceCreatedExchange,
                InvoiceCreatedRoutingkey = invoiceCreatedRoutingkey,
            });
        }
    }
}
