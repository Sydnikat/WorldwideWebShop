using Dal.Config;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.Config;
using Web.DTOs.Config;
using Web.Middlewares;
using Web.Middlewares.Authentications;
using Web.Middlewares.Authorizations;
using Web.Services.Config;

namespace Web
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddMongodb(this.Configuration);

            services.AddRabbitmqSettings(this.Configuration);

            services.AddMassTransitSetup(this.Configuration);

            services.AddServices(this.Configuration);

            services.AddWWSAuthentication();
            services.AddWWSAuthorization();

            services.AddControllers()
                .SetupJsonConverters()
                .SetupJsonSerialization();;
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseRouting();

            app.UseMiddlewares();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
