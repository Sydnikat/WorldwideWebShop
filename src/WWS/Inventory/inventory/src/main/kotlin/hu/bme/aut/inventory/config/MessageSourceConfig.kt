package hu.bme.aut.inventory.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.support.ReloadableResourceBundleMessageSource

@Configuration
class MessageSourceConfig {

    @Bean(name = ["utf8MessageSource"])
    fun messageSource() = ReloadableResourceBundleMessageSource().apply {
        setBasename("classpath:/messages")
        setDefaultEncoding("UTF-8")
    }
}