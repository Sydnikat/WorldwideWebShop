using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Mapping
{
    public class EnvironmentVariables
    {
        public static readonly string RabbimqHost = "RABBITMQ_HOST";
        public static readonly string RabbimqUsername = "RABBITMQ_USERNAME";
        public static readonly string RabbimqPassword = "RABBITMQ_PASSWORD";
        public static readonly string RabbimqFullHost = "RABBITMQ_FULL_HOST";

        public static readonly string RabbimqOrderStateChangedQueue = "RABBITMQ_ORDER_STATE_CHANGED_QUEUE_FULL_URL";
        public static readonly string RabbimqOrderStateChangedQueueName = "RABBITMQ_ORDER_STATE_CHANGED_QUEUE_NAME";

        public static readonly string RabbimqOrderCreatedQueue = "RABBITMQ_ORDER_CREATED_QUEUE";
        public static readonly string RabbimqOrderCreatedExchange = "RABBITMQ_ORDER_CREATED_EXCHANGE";
        public static readonly string RabbimqOrderCreatedRoutingkey = "RABBITMQ_ORDER_CREATED_ROUTINGKEY";

        public static readonly string RedisUrl = "REDIS_URL";
        public static readonly string RedisCartsInstance = "REDIS_CARTS_INSTANCE";

        public static readonly string MSSQLConnection = "MSSQL_CONNECTION";
    }
}
