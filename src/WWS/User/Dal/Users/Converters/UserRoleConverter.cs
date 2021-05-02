using System.ComponentModel;

namespace Dal.Users.Converters
{
    public static class UserRoleConverter
    {
        public static Domain.Users.User.UserRole ToDomain(this DbEntities.User.UserRole role)
        {
            switch (role)
            {
                case DbEntities.User.UserRole.Customer:
                    return Domain.Users.User.UserRole.Customer;
                case DbEntities.User.UserRole.Admin:
                    return Domain.Users.User.UserRole.Admin;
                default:
                    throw new InvalidEnumArgumentException();
            }
        }

        public static DbEntities.User.UserRole ToDal(this Domain.Users.User.UserRole role)
        {
            switch (role)
            {
                case Domain.Users.User.UserRole.Customer:
                    return DbEntities.User.UserRole.Customer;
                case Domain.Users.User.UserRole.Admin:
                    return DbEntities.User.UserRole.Admin;
                default:
                    throw new InvalidEnumArgumentException();
            }
        }
    }
}
