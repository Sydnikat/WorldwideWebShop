package hu.bme.aut.inventory.service.notification

import hu.bme.aut.inventory.config.RabbitmqConfig
import hu.bme.aut.inventory.domain.Category
import hu.bme.aut.inventory.domain.Discount
import hu.bme.aut.inventory.integrationEvent.event.CategoryDiscountCreatedEvent
import kotlinx.coroutines.runBlocking
import org.springframework.amqp.core.Exchange
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.stereotype.Service

@Service
class NotificationService(
    private val rabbitTemplate: RabbitTemplate,
    @Qualifier("categoryDiscountExchange") private val categoryDiscountExchange: Exchange,
    private val config: RabbitmqConfig
) {
    suspend fun notifyCategoryDiscountCreation(discount: Discount, category: Category) {

        runBlocking {
            val message = CategoryDiscountCreatedEvent(
                categoryName = category.name,
                discount = discount.value,
                startDate = discount.startDate.toString(),
                endDate = discount.endDate.toString()
            )
            rabbitTemplate.convertAndSend(
                categoryDiscountExchange.name,
                config.categoryDiscountRoutingkey,
                message
            )
        }
    }
}