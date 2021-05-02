using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dal.Users.DbEntities
{
    public class User
    {
        public User(string _id, Guid id, string userName, string password, string userFullName, UserRole role, Email email)
        {
            UserName = userName;
            Password = password;
            Role = role;
            Email = email;
            UserFullName = userFullName;
            this._id = _id;
            Id = id;
        }

        public enum UserRole
        {
            Customer,
            Admin
        }

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string _id { get; set; }

        [BsonElement("id")]
        public Guid Id { get; set; }

        [BsonElement("UserName")]
        public string UserName { get; set; }

        [BsonElement("Password")]
        public string Password { get; set; }

        [BsonElement("UserFullName")]
        public string UserFullName { get; set; }

        [BsonElement("Role")]
        [BsonRepresentation(BsonType.String)]
        public UserRole Role { get; set; }

        [BsonElement("Email")]
        public Email Email { get; set; }
    }
}
