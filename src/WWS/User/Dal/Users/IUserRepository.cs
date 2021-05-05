using Domain.Users;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Users
{
    public interface IUserRepository
    {
        public Task<User> FindById(Guid id);
        public Task<User> FindByUserName(string userName);
        public Task<User> FindByEmail(string emailStr);
        public Task<User> Save(User user);
    }
}
