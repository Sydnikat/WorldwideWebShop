using Microsoft.Extensions.DependencyInjection;
using Polly;
using Refit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Web.InventoryClient;
using Web.UserClient;

namespace Inventory.Supply.Web.Config
{
    public static class RefitBuilder
    {
        public static void AddRefit(this IServiceCollection services)
        {

            bool RetryableStatusPredicate(HttpStatusCode statusCode) =>
                statusCode == HttpStatusCode.BadGateway ||
                statusCode == HttpStatusCode.ServiceUnavailable ||
                statusCode == HttpStatusCode.GatewayTimeout;

            services.AddRefitClient<IUserApiClient>()
                .ConfigureHttpClient(c => c.BaseAddress = new Uri("http://user"))
                .AddPolicyHandler(
                    Policy.Handle<HttpRequestException>()
                    .OrResult<HttpResponseMessage>(msg => RetryableStatusPredicate(msg.StatusCode))
                    .WaitAndRetryAsync(3, retryCount => TimeSpan.FromMilliseconds(100 * Math.Pow(2, retryCount))));

            services.AddRefitClient<IInventoryApiClient>()
                .ConfigureHttpClient(c => c.BaseAddress = new Uri("http://inventory:8080"))
                .AddPolicyHandler(
                    Policy.Handle<HttpRequestException>()
                    .OrResult<HttpResponseMessage>(msg => RetryableStatusPredicate(msg.StatusCode))
                    .WaitAndRetryAsync(3, retryCount => TimeSpan.FromMilliseconds(100 * Math.Pow(2, retryCount))));

            
        }
    }
}
