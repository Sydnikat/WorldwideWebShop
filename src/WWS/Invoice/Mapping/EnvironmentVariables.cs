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

        public static readonly string RabbimqInvoiceCreatedQueue = "RABBITMQ_INVOICE_CREATED_QUEUE";
        public static readonly string RabbimqInvoiceCreatedExchange = "RABBITMQ_INVOICE_CREATED_EXCHANGE";
        public static readonly string RabbimqInvoiceCreatedRoutingkey = "RABBITMQ_INVOICE_CREATED_ROUTINGKEY";

        public static readonly string MongodbInvoiceCollectionName = "MONGODB_INVOICE_COLLECTION_NAME";
        public static readonly string MongodbConnectionString = "MONGODB_CONNECTION_STRING";
        public static readonly string MongodbDatabaseName = "MONGODB_DATABASE_NAME";
    }
}
