using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Config
{
    public class RedisSettings : IRedisSettings
    {
        public string Url { get; set; }
        public string CartsInstance { get; set; }
    }

    public interface IRedisSettings
    {
        public string Url { get; set; }
        public string CartsInstance { get; set; }
    }
}
