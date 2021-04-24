using Domain.Cart;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
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
            this.cacheEntryOptions = new DistributedCacheEntryOptions().SetAbsoluteExpiration(TimeSpan.FromMinutes(2));
        }

        public async Task<Cart> TryGet(string customerId)
        {
            var valueString = await cache.GetStringAsync(getCacheKey(customerId));
            if (valueString == null)
                return null;
            else
                return JsonConvert.DeserializeObject<Cart>(valueString);
        }

        public async Task Set(Cart cart)
        {
            var valueString = JsonConvert.SerializeObject(cart);
            await cache.SetStringAsync(key: getCacheKey(cart.CustomerId), value: valueString, options: cacheEntryOptions);
        }

        public Task Invalidate(string customerId) => cache.RemoveAsync(getCacheKey(customerId));

        private string getCacheKey(string customerId) => $"carts-{customerId}";
    }
}
