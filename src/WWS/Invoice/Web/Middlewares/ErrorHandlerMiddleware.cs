using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Web.DTOs.Exception;

namespace Web.Middlewares
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;

        private readonly JsonSerializerOptions options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };


        public ErrorHandlerMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public class WWSSException : Exception
        {
            public override string Message { get; }

            public int StatusCode { get; set; }

            public object[] Params { get; set; }

            public WWSSException(string message, int statusCode, params object[] args) : base(message)
            {
                this.Message = message;
                this.StatusCode = statusCode;
                this.Params = args;
            }
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (WWSSException error)
            {
                // TODO: Proper logging...
                Console.WriteLine($"${error.Message} : ${error.Params}");

                var response = context.Response;
                response.ContentType = "application/json";
                response.StatusCode = error.StatusCode;

                var result = JsonSerializer.Serialize(new GlobalExceptionResponse(error.Message, error.StatusCode), options);
                await response.WriteAsync(result);
            }
            catch (Exception e)
            {
                // TODO: Proper logging...
                Console.WriteLine($"Unhandled Exception : ${e.Message}");

                var response = context.Response;
                response.ContentType = "application/json";
                response.StatusCode = StatusCodes.Status500InternalServerError;

                
                var result = JsonSerializer.Serialize(new GlobalExceptionResponse(e.Message, StatusCodes.Status500InternalServerError), options);
                await response.WriteAsync(result);
            }
        }
    }
}
