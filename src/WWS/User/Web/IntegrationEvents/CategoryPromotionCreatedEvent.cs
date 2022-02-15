using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.IntegrationEvents
{
    public class CategoryPromotionCreatedEvent : ICategoryPromotionCreatedEvent
    {
        public string CategoryName { get; set; }
        public int Discount { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string email { get; set; }
    }

    public interface ICategoryPromotionCreatedEvent
    {
        public string CategoryName { get; set; }
        public int Discount { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string email { get; set; }
    }
}
