package hu.bme.aut.mail.service.mail

import com.fasterxml.jackson.annotation.JsonProperty
import hu.bme.aut.mail.util.process
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.MessageSource
import org.springframework.mail.MailException
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.scheduling.annotation.Async
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.thymeleaf.TemplateEngine
import java.util.Locale
import javax.mail.Message
import javax.mail.internet.InternetAddress

@Service
class MailService(
    val mailSender: JavaMailSender,
    @Value("\${mail.noReplyAddress}")
    val noReplyAddress: String,
    @Qualifier("mailTemplateEngine")
    val templateEngine: TemplateEngine,
    @Qualifier("utf8MessageSource")
    val messageSource: MessageSource
) {
    @Async
    fun sendMail(
        from: String,
        to: String,
        subjectId: String,
        locale: Locale = Locale("hu"),
        templateName: String,
        params: Map<String, Any>
    ) {
        try {
            mailSender.send {
                it.setFrom(from)
                it.setRecipient(Message.RecipientType.TO, InternetAddress(to))
                it.subject = messageSource.getMessage(subjectId, emptyArray(), locale)
                val text = templateEngine.process(templateName, locale, params)
                it.setText(text, "UTF-8", "html")
            }
        } catch (e: MailException) {
            println(e.message)
            e.printStackTrace()
        }
    }

    @Async
    fun sendMailWithAttachment(
        from: String,
        to: String,
        subjectId: String,
        locale: Locale = Locale("hu"),
        templateName: String,
        params: Map<String, Any>,
        attachmentName: String,
        attachmentContent: ByteArray,
        attachmentContentType: String
    ) {
        val message = mailSender.createMimeMessage()
        val helper = MimeMessageHelper(message, true, "UTF-8")
        helper.setSubject(messageSource.getMessage(subjectId, emptyArray(), locale))
        helper.setText(templateEngine.process(templateName, locale, params), true)
        helper.setTo(InternetAddress(to))
        helper.setFrom(from)
        helper.addAttachment(attachmentName, { attachmentContent.inputStream() }, attachmentContentType)
        try {
            mailSender.send(message)
        } catch (e: MailException) {

        }
    }

    @Async
    fun sendMailToUser(
        from: String,
        recipient: String,
        subjectId: String,
        templateName: String,
        params: Map<String, Any>
    ) {
        sendMail(
            from = from,
            to = recipient,
            subjectId = subjectId,
            templateName = templateName,
            locale = Locale("hu"),
            params = params
        )
    }

    @Async
    fun sendEmailConfirmationMail(
        email: String,
        userName: String,
        locale: Locale? = null
    ) {
        sendMail(
            from = noReplyAddress,
            to = email,
            subjectId = "registration.title",
            locale = locale ?: Locale("hu"),
            templateName = "registration",
            params = mapOf(
                "userName" to userName
            )
        )
    }

    @Async
    fun sendInvoiceCreatedMail(
        orderCode: String,
        totalPrice: Double,
        created: String,
        zip: String,
        city: String,
        street: String,
        countryCode: String,
        email: String,
        locale: Locale? = null
    ) {
        sendMail(
            from = noReplyAddress,
            to = email,
            subjectId = "invoice_created.title",
            locale = locale ?: Locale("hu"),
            templateName = "invoice_created",
            params = mapOf(
                "orderCode" to orderCode,
                "totalPrice" to totalPrice,
                "created" to created,
                "zip" to zip,
                "city" to city,
                "street" to street,
                "countryCode" to countryCode,
            )
        )
    }
}