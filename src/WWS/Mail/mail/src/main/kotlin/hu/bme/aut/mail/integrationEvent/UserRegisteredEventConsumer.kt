package hu.bme.aut.mail.integrationEvent

import hu.bme.aut.mail.integrationEvent.event.UserRegisteredEvent
import hu.bme.aut.mail.service.mail.MailService
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Service
import java.util.Locale

@Service
class UserRegisteredEventConsumer(
    private val mailService: MailService
) {

    @RabbitListener(queues = ["\${rabbitmq.mail.queue}"])
    @RabbitHandler
    fun userRegisteredEventListenerSpecific(event: UserRegisteredEvent) {
        mailService.sendEmailConfirmationMail(
            email = event.email,
            userName = event.userName,
            locale = Locale("hu")
        )
    }
}

