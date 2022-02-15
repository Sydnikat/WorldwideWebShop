package hu.bme.aut.inventory.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.Exchange
import org.springframework.amqp.core.ExchangeBuilder
import org.springframework.amqp.core.Queue
import org.springframework.amqp.core.QueueBuilder
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter
import org.springframework.amqp.support.converter.MessageConverter
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration


@Configuration
class RabbitmqConfig(
    @Value("\${rabbitmq.order.orderCreatedQueue}")
    val orderCreatedQueue: String,

    @Value("\${rabbitmq.order.orderCreatedExchange}")
    val orderCreatedExchange: String,

    @Value("\${rabbitmq.order.orderCreatedRoutingkey}")
    val orderCreatedRoutingkey: String,

    @Value("\${rabbitmq.discount.categoryDiscountQueue}")
    val categoryDiscountQueue: String,

    @Value("\${rabbitmq.discount.categoryDiscountExchange}")
    val categoryDiscountExchange: String,

    @Value("\${rabbitmq.discount.categoryDiscountRoutingkey}")
    val categoryDiscountRoutingkey: String,

    @Value("\${rabbitmq.username}")
    val username: String,

    @Value("\${rabbitmq.password}")
    val password: String,

    @Value("\${rabbitmq.host}")
    val host: String
) {
    @Bean(name = ["orderCreatedQueue"])
    fun orderCreatedQueue(): Queue {
        return QueueBuilder.durable(orderCreatedQueue).build()
    }

    @Bean(name = ["orderCreatedExchange"])
    fun orderCreatedExchange(): Exchange {
        return ExchangeBuilder.fanoutExchange(orderCreatedExchange).durable(true).build()
    }

    @Bean(name = ["categoryDiscountQueue"])
    fun categoryDiscountQueue(): Queue {
        return QueueBuilder.durable(categoryDiscountQueue).build()
    }

    @Bean(name = ["categoryDiscountExchange"])
    fun categoryDiscountExchange(): Exchange {
        return ExchangeBuilder.fanoutExchange(categoryDiscountExchange).durable(true).build()
    }

    @Bean
    fun categoryDiscountBinding(
        @Qualifier("categoryDiscountQueue") queue: Queue,
        @Qualifier("categoryDiscountExchange") exchange: Exchange
    ): Binding {
        return BindingBuilder
            .bind(queue)
            .to(exchange)
            .with(categoryDiscountRoutingkey)
            .noargs()
    }

    @Bean
    fun orderCreatedBinding(
        @Qualifier("orderCreatedQueue") queue: Queue,
        @Qualifier("orderCreatedExchange") exchange: Exchange
    ): Binding {
        return BindingBuilder
            .bind(queue)
            .to(exchange)
            .with(orderCreatedRoutingkey)
            .noargs()
    }

    @Bean(name = ["rabbitmq"])
    fun connectionFactory(): CachingConnectionFactory {
        val cachingConnectionFactory = CachingConnectionFactory(host)
        cachingConnectionFactory.username = username
        cachingConnectionFactory.setPassword(password)
        return cachingConnectionFactory
    }

    @Bean
    fun jsonMessageConverter(): MessageConverter {
        return Jackson2JsonMessageConverter()
    }

    @Bean
    fun rabbitTemplate(@Qualifier("rabbitmq") connectionFactory: CachingConnectionFactory): RabbitTemplate {
        val rabbitTemplate = RabbitTemplate(connectionFactory)
        rabbitTemplate.messageConverter = jsonMessageConverter()
        return rabbitTemplate
    }

}
