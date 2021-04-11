using Dal.OrderItems.DbEntites;
using Dal.Orders.DbEntities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Dal
{
    class WWSContext : DbContext
    {
        public WWSContext(DbContextOptions<WWSContext> options) 
            : base(options)
        {

        }

        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItmes { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.ApplyConfigurationsFromAssembly(
                assembly: Assembly.GetAssembly(typeof(WWSContext)));
        }
    }
}
