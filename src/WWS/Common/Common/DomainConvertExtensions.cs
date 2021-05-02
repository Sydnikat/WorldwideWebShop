using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Common
{
    public static class DomainConvertExtensions
    {
        public static async Task<TDomain> ToDomainOrNull<TDal, TDomain>(
            this Task<TDal> dalObjectRetrieveTask,
            Func<TDal, TDomain> domainConverter)
            where TDomain : class
        {
            var dalResult = await dalObjectRetrieveTask.ConfigureAwait(false);
            if (dalResult == null)
                return null;
            else
                return domainConverter(dalResult);
        }

        public static async Task<TDomain> ToDomainOrNull<TDal, TDomain>(
            this ValueTask<TDal> dalObjectRetrieveTask,
            Func<TDal, TDomain> domainConverter)
            where TDomain : class
        {
            var dalResult = await dalObjectRetrieveTask.ConfigureAwait(false);
            if (dalResult == null)
                return null;
            else
                return domainConverter(dalResult);
        }

        public static TDomain ToDomainOrNull<TDal, TDomain>(this TDal dalResult, Func<TDal, TDomain> domainConverter)
            where TDomain : class
        {
            if (dalResult == null)
                return null;
            else
                return domainConverter(dalResult);
        }

        public static async Task<IReadOnlyCollection<TDomain>> ToDomainOrNull<TDal, TDomain>(
            this Task<List<TDal>> dalObjectRetrieveTask,
            Func<TDal, TDomain> domainConverter)
            where TDomain : class
        {
            var dalResult = await dalObjectRetrieveTask.ConfigureAwait(false);
            return dalResult.ToDomainOrNull(domainConverter);
        }

        public static IReadOnlyCollection<TDomain> ToDomainOrNull<TDal, TDomain>(this ICollection<TDal> list, Func<TDal, TDomain> domainConverter)
            where TDomain : class
        {
            if (list == null)
                return new List<TDomain>();
            else
                return list
                    .Select(domainConverter)
                    .ToList();
        }

        public static TDal ToDalOrNull<TDomain, TDal>(this TDomain domain, Func<TDomain, TDal> dalConverter)
            where TDal : class
        {
            if (domain == null)
                return null;
            else
                return dalConverter(domain);
        }

        public static IReadOnlyCollection<TDal> ToDalOrNull<TDomain, TDal>(this ICollection<TDomain> list, Func<TDomain, TDal> dalConverter)
            where TDal : class
            => list?.Select(dalConverter)
                .ToList();
    }
}
