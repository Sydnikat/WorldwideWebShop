package hu.bme.aut.mail.config

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.ApplicationContext
import org.springframework.context.MessageSource
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.JavaMailSenderImpl
import org.thymeleaf.TemplateEngine
import org.thymeleaf.spring5.SpringTemplateEngine
import org.thymeleaf.spring5.templateresolver.SpringResourceTemplateResolver
import org.thymeleaf.templatemode.TemplateMode.HTML
import org.thymeleaf.templateresolver.ITemplateResolver

@Configuration
class MailConfig(
    @Value("\${mail.smtpHost}")
    val smtpHost: String,
    @Value("\${mail.smtpPort}")
    val smtpPort: Int,
    @Value("\${mail.smtpUser}")
    val smtpUser: String,
    @Value("\${mail.smtpPass}")
    val smtpPass: String
) {

    @Bean
    fun getJavaMailSender(): JavaMailSender = JavaMailSenderImpl().apply {
        host = smtpHost
        port = smtpPort
        username = smtpUser
        password = smtpPass
        javaMailProperties.putAll(
            listOf(
                "mail.transport.protocol" to "smtp",
                "mail.smtp.starttls.enable" to "true",
                "mail.smtp.starttls.required" to "true",
                "mail.smtp.auth" to "true",
                "mail.debug" to "false",
                "mail.smtp.ssl.trust" to "*",
                "mail.smtps.timeout" to "5000",
                "mail.smtps.connectiontimeout" to "5000"
            )
        )
    }

    @Bean(name = ["mailTemplateEngine"])
    fun templateEngine(
        @Qualifier("htmlResolver")
        templateResolver: ITemplateResolver,
        @Qualifier("utf8MessageSource")
        messageSource: MessageSource
    ): TemplateEngine = SpringTemplateEngine().apply {
        setTemplateResolver(templateResolver)
        setTemplateEngineMessageSource(messageSource)
        enableSpringELCompiler = true
    }

    @Bean(name = ["htmlResolver"])
    fun templateResolver(applicationContext: ApplicationContext): ITemplateResolver =
        SpringResourceTemplateResolver().apply {
            setApplicationContext(applicationContext)
            characterEncoding = "UTF-8"
            suffix = ".html"
            prefix = "classpath:/templates/"
            templateMode = HTML
        }
}