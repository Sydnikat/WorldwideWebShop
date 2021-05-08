package hu.bme.aut.mail.integrationEvent

import hu.bme.aut.mail.integrationEvent.event.InvoiceCreatedEvent
import hu.bme.aut.mail.service.mail.MailService
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Service
import java.util.Locale

@Service
class InvoiceCreatedEventConsumer(
    private val mailService: MailService
) {

    @RabbitListener(queues = ["\${rabbitmq.invoice.invoiceCreatedQueue}"])
    @RabbitHandler
    fun invoiceCreatedEventListener(event: InvoiceCreatedEvent) {
        mailService.sendInvoiceCreatedMail(
            email = event.email,
            orderCode = event.orderCode,
            totalPrice = event.totalPrice,
            created = event.created,
            zip = event.zip,
            city = event.city,
            countryCode = event.countryCode,
            street = event.street,
            locale = Locale("hu")
        )
    }
}