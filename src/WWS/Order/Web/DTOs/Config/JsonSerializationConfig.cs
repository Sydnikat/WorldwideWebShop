using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace HWS.Controllers.DTOs.Config
{
    public static class JsonSerializationConfig
    {
        public static IMvcBuilder SetupJsonSerialization(this IMvcBuilder builder)
        {
            builder.AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            });

            return builder;
        }
    }
}
