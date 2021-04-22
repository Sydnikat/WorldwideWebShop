using HWS.Controllers.DTOs.Converters;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace HWS.Controllers.DTOs.Config
{
    public static class ConverterConfig
    {
        public static IMvcBuilder SetupJsonConverters(this IMvcBuilder builder)
        {
            builder.AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new GuidConverter());
                options.JsonSerializerOptions.Converters.Add(new DateTimeConverter());
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            });

            return builder;
        }
    }
}
