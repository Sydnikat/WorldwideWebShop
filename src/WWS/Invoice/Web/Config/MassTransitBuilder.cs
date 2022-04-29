using MassTransit;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.IntegrationEvents;

namespace Web.Config
{
    public static class MassTransitBuilder
    {
        public static void AddMassTransitSetup(this IServiceCollection services, IConfiguration config)
        {
            var sp = services.BuildServiceProvider();
            var settings = sp.GetService<IRabbimqSettings>();

            services.AddMassTransit(s =>
            {
                
                s.UsingRabbitMq((ctx, c) =>
                {
                    c.Host(new Uri(settings.FullHost),
                        hostConfig =>
                        {
                            hostConfig.Username(settings.Username);
                            hostConfig.Password(settings.Password);
                        });
                });

                EndpointConvention.Map<IOrderStateChangedEvent>(new Uri(settings.OrderStateChangedQueue));
                
            });

            services.AddMassTransitHostedService();
        }
    }
}
