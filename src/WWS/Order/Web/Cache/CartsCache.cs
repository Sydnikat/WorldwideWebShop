using Microsoft.Extensions.Caching.Distributed;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Cache
{
    public class CartsCache
    {
        private readonly IDistributedCache cache;
        private readonly DistributedCacheEntryOptions cacheEntryOptions;

        public CartsCache(IDistributedCache cache)
        {
            this.cache = cache;
            this.cacheEntryOptions = new DistributedCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromMinutes(15));
        }

        public async Task TryGet()
        {
            throw new NotImplementedException();
        }

        public async Task Set()
        {
            throw new NotImplementedException();
        }

        public Task Invalidate() => throw new NotImplementedException();

        private string getCacheKey() => throw new NotImplementedException();
    }
}
