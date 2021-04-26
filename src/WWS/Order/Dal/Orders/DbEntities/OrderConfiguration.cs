using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Orders.DbEntities
{
    internal class OrderConfiguration : IEntityTypeConfiguration<Order>
    {
        public void Configure(EntityTypeBuilder<Order> builder)
        {
            builder
                .ToTable("CustomerOrder")
                .Property(o => o._id).HasColumnName("OrderId");

            builder
                .HasMany(o => o.Items)
                .WithOne()
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
