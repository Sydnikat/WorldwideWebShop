using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mapping
{
    public static class EnvironmentVariables
    {
        public static readonly string RabbimqHost = "RABBITMQ_HOST";
        public static readonly string RabbimqUsername = "RABBITMQ_USERNAME";
        public static readonly string RabbimqPassword = "RABBITMQ_PASSWORD";

        public static readonly string RabbimqMailQueue = "RABBITMQ_MAIL_QUEUE";
        public static readonly string RabbimqMailExchange = "RABBITMQ_MAIL_EXCHANGE";
        public static readonly string RabbimqMailRoutingKey = "RABBITMQ_MAIL_ROUTINGKEY";

        public static readonly string RabbimqCategoryDiscountQueue = "RABBITMQ_CATEGORY_DISCOUNT_QUEUE";
        public static readonly string RabbimqCategoryDiscountExchange = "RABBITMQ_CATEGORY_DISCOUNT_EXCHANGE";
        public static readonly string RabbimqCategoryDiscountRoutingkey = "RABBITMQ_CATEGORY_DISCOUNT_ROUTINGKEY";

        public static readonly string RabbimqCategoryPromotionQueue = "RABBITMQ_CATEGORY_PROMOTION_QUEUE";
        public static readonly string RabbimqCategoryPromotionExchange = "RABBITMQ_CATEGORY_PROMOTION_EXCHANGE";
        public static readonly string RabbimqCategoryPromotionRoutingkey = "RABBITMQ_CATEGORY_PROMOTION_ROUTINGKEY";

        public static readonly string MongodbUsersCollectionName = "MONGODB_USER_COLLECTION_NAME";
        public static readonly string MongodbConnectionString = "MONGODB_CONNECTION_STRING";
        public static readonly string MongodbDatabaseName = "MONGODB_DATABASE_NAME";

        public static readonly string JwtTokenSecret = "JWT_TOKEN_SECRET";
        public static readonly string JwtTokenAccessTokenExpiration = "JWT_TOKEN_ACCESS_TOKEN_EXP";
        public static readonly string JwtTokenRefreshTokenExpiration = "JWT_TOKEN_REFRESH_TOKEN_EXP";
    }
}
