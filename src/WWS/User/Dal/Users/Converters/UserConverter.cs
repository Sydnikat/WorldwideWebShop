using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Users.Converters
{
    public static class UserConverter
    {
        public static Func<DbEntities.User, Domain.Users.User> ToDomain =>
            user => new Domain.Users.User(
                _id: user._id,
                id: user.Id,
                userName: user.UserName,
                userFullName: user.UserFullName,
                password: user.Password,
                roles: user.Roles,
                email: user.Email.ToDomain(),
                address: user.Address.ToDomain(),
                phone: user.Phone.ToDomain()
                );

        public static Func<Domain.Users.User, DbEntities.User> ToDalNew =>
            user => new DbEntities.User(
                _id: null,
                id: user.Id,
                userName: user.UserName,
                userFullName: user.UserFullName,
                password: user.Password,
                roles: user.Roles,
                email: user.Email.ToDal(),
                address: user.Address.ToDal(),
                phone: user.Phone.ToDal()
                );

        public static Func<Domain.Users.User, DbEntities.User> ToDal =>
            user => new DbEntities.User(
                _id: user._id,
                id: user.Id,
                userName: user.UserName,
                userFullName: user.UserFullName,
                password: user.Password,
                roles: user.Roles,
                email: user.Email.ToDal(),
                address: user.Address.ToDal(),
                phone: user.Phone.ToDal()
                );
    }
}
