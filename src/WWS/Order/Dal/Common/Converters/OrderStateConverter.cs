using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Common.Converters
{
    public static class OrderStateConverter
    {
        public static Domain.Orders.Order.OrderState ToDomain(this Orders.DbEntities.Order.OrderState state)
        {
            switch(state)
            {
                case Orders.DbEntities.Order.OrderState.InProgress:
                    return Domain.Orders.Order.OrderState.InProgress;
                case Orders.DbEntities.Order.OrderState.Billed:
                    return Domain.Orders.Order.OrderState.Billed;
                default:
                    throw new InvalidEnumArgumentException();
            }
        }

        public static Orders.DbEntities.Order.OrderState ToDal(this Domain.Orders.Order.OrderState state)
        {
            switch (state)
            {
                case Domain.Orders.Order.OrderState.InProgress:
                    return Orders.DbEntities.Order.OrderState.InProgress;
                case Domain.Orders.Order.OrderState.Billed:
                    return Orders.DbEntities.Order.OrderState.Billed;
                default:
                    throw new InvalidEnumArgumentException();
            }
        }
    }
}
