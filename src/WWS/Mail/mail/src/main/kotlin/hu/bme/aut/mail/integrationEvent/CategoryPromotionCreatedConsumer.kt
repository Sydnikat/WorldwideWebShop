package hu.bme.aut.mail.integrationEvent

import hu.bme.aut.mail.integrationEvent.event.CategoryPromotionCreatedEvent
import hu.bme.aut.mail.service.mail.MailService
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Service

@Service
class CategoryPromotionCreatedConsumer(
    private val mailService: MailService
) {
    @RabbitListener(queues = ["\${rabbitmq.promotion.categoryPromotionQueue}"])
    @RabbitHandler
    fun categoryDiscountCreatedListener(event: CategoryPromotionCreatedEvent) {
        println(event)
        mailService.sendCategoryDiscountCreatedMail(
            categoryName = event.categoryName,
            discount = event.discount.toString(),
            startDate = event.startDate,
            endDate = event.endDate,
            email = event.email
        )
    }
}