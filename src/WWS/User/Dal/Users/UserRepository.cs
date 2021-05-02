using Common;
using Dal.Config;
using Dal.Users.Converters;
using Domain.Users;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Users
{
    public class UserRepository : IUserRepository
    {
        private readonly IMongoCollection<DbEntities.User> _users;
        public UserRepository(IUserDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _users = database.GetCollection<DbEntities.User>(settings.UsersCollectionName);
        }

        public async Task<Domain.Users.User> FindById(Guid id)
        {
            var filter = Builders<DbEntities.User>.Filter.Eq("Id", id.ToString());
            var query = await _users.FindAsync(filter);
            return query.FirstOrDefault().ToDomainOrNull(UserConverter.ToDomain);
        }

        public async Task<Domain.Users.User> FindByUserName(string userName)
        {
            if (userName == null || userName == "")
                return null;

            var query = await _users.FindAsync(user => user.UserName == userName);
            return query.FirstOrDefault().ToDomainOrNull(UserConverter.ToDomain);
        }

        public async Task<Domain.Users.User> Save(Domain.Users.User user)
        {
            if (user == null)
                return null;

            var dbUser = user.ToDalOrNull(UserConverter.ToDalNew);

            await _users.InsertOneAsync(dbUser).ConfigureAwait(false);

            return user;
        }
    }
}
