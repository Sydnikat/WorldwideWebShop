package hu.bme.aut.mail.config

import org.springframework.amqp.core.Binding
import org.springframework.amqp.core.BindingBuilder
import org.springframework.amqp.core.Exchange
import org.springframework.amqp.core.ExchangeBuilder
import org.springframework.amqp.core.Queue
import org.springframework.amqp.core.QueueBuilder
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory
import org.springframework.amqp.rabbit.connection.CachingConnectionFactory
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter
import org.springframework.amqp.support.converter.MessageConverter
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.messaging.converter.MappingJackson2MessageConverter





@Configuration
class RabbitmqConfig(
    @Value("\${rabbitmq.mail.queue}")
    val mailQueue: String,

    @Value("\${rabbitmq.mail.exchange}")
    val mailExchange: String,

    @Value("\${rabbitmq.mail.routingkey}")
    val mailRoutingKey: String,

    @Value("\${rabbitmq.invoice.invoiceCreatedQueue}")
    val invoiceCreatedQueue: String,

    @Value("\${rabbitmq.invoice.invoiceCreatedExchange}")
    val invoiceCreatedExchange: String,

    @Value("\${rabbitmq.invoice.invoiceCreatedRoutingkey}")
    val invoiceCreatedRoutingkey: String,

    @Value("\${rabbitmq.promotion.categoryPromotionQueue}")
    val categoryPromotionQueue: String,

    @Value("\${rabbitmq.promotion.categoryPromotionExchange}")
    val categoryPromotionExchange: String,

    @Value("\${rabbitmq.promotion.categoryPromotionRoutingkey}")
    val categoryPromotionRoutingkey: String,

    @Value("\${rabbitmq.username}")
    val username: String,

    @Value("\${rabbitmq.password}")
    val password: String,

    @Value("\${rabbitmq.host}")
    val host: String
) {
    @Bean(name = ["mailQueue"])
    fun queue(): Queue {
        return QueueBuilder.durable(mailQueue).build()
    }

    @Bean(name = ["mailExchange"])
    fun myExchange(): Exchange {
        return ExchangeBuilder.fanoutExchange(mailExchange).durable(true).build()
    }

    @Bean
    fun mailBinding(
        @Qualifier("mailQueue") queue: Queue,
        @Qualifier("mailExchange") exchange: Exchange
    ): Binding {
        return BindingBuilder
            .bind(queue)
            .to(exchange)
            .with(mailRoutingKey)
            .noargs()
    }

    @Bean(name = ["invoiceCreatedQueue"])
    fun invoiceCreatedQueue(): Queue {
        return QueueBuilder.durable(invoiceCreatedQueue).build()
    }

    @Bean(name = ["invoiceCreatedExchange"])
    fun invoiceCreatedExchange(): Exchange {
        return ExchangeBuilder.fanoutExchange(invoiceCreatedExchange).durable(true).build()
    }

    @Bean
    fun invoiceCreatedBinding(
        @Qualifier("invoiceCreatedQueue") queue: Queue,
        @Qualifier("invoiceCreatedExchange") exchange: Exchange
    ): Binding {
        return BindingBuilder
            .bind(queue)
            .to(exchange)
            .with(invoiceCreatedRoutingkey)
            .noargs()
    }

    @Bean(name = ["categoryPromotionQueue"])
    fun categoryPromotionQueue(): Queue {
        return QueueBuilder.durable(categoryPromotionQueue).build()
    }

    @Bean(name = ["categoryPromotionExchange"])
    fun categoryPromotionExchange(): Exchange {
        return ExchangeBuilder.fanoutExchange(categoryPromotionExchange).durable(true).build()
    }

    @Bean
    fun categoryPromotionBinding(
        @Qualifier("categoryPromotionQueue") queue: Queue,
        @Qualifier("categoryPromotionExchange") exchange: Exchange
    ): Binding {
        return BindingBuilder
            .bind(queue)
            .to(exchange)
            .with(categoryPromotionRoutingkey)
            .noargs()
    }

    @Bean
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
    fun rabbitTemplate(connectionFactory: CachingConnectionFactory): RabbitTemplate {
        val rabbitTemplate = RabbitTemplate(connectionFactory)
        rabbitTemplate.messageConverter = jsonMessageConverter()
        return rabbitTemplate
    }

}
