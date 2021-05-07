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

        public async Task<Domain.Users.User> FindByEmail(string emailStr)
        {
            var filter = Builders<DbEntities.User>.Filter.Where(u => u.Email.Value == emailStr);
            var query = await _users.FindAsync(filter);
            return query.FirstOrDefault().ToDomainOrNull(UserConverter.ToDomain);
        }

        public async Task<Domain.Users.User> FindById(Guid id)
        {
            var filter = Builders<DbEntities.User>.Filter.Where(u => u.Id == id);
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

        public async Task<Domain.Users.User> Update(Domain.Users.User user)
        {
            if (user == null)
                return null;

            var dbUser = user.ToDalOrNull(UserConverter.ToDal);

            var filter = Builders<DbEntities.User>.Filter.Where(u => u.Id == user.Id);
            var update = Builders<DbEntities.User>.Update
                .Set(u => u.Phone.Value, user.Phone.Value)
                .Set(u => u.Phone.Confirmed, user.Phone.Confirmed)
                .Set(u => u.UserFullName, user.UserFullName)
                .Set(u => u.Address.Zip, user.Address.Zip)
                .Set(u => u.Address.City, user.Address.City)
                .Set(u => u.Address.Street, user.Address.Street)
                .Set(u => u.Address.CountryCode, user.Address.CountryCode);

            await _users.UpdateOneAsync(filter, update).ConfigureAwait(false);

            return user;
        }
    }
}
