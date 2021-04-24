using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Services.Exceptions
{
    public class StockIsNotEnoughException : Exception
    {
        public StockIsNotEnoughException(long itemId, int stock, int count)
        {
            ItemId = itemId;
            Stock = stock;
            Count = count;
        }

        public long ItemId { get; set; }
        public int Stock { get; set; }
        public int Count { get; set; }
    }
}
