using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Common.DTOs
{
    public static class JsonSerializationOptions
    {
        public static readonly JsonSerializerOptions options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public static readonly JsonSerializerOptions deserializeOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = null
        };
    }
}
