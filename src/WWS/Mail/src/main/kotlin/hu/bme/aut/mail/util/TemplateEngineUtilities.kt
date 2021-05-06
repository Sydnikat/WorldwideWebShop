package hu.bme.aut.mail.util

import org.thymeleaf.TemplateEngine
import org.thymeleaf.context.Context
import java.util.Locale

fun TemplateEngine.process(templateName: String, localeOpt: Locale?, params: Map<String, Any>) =
    process(
        templateName,
        Context().apply {
            setVariables(params)
            localeOpt?.let {
                locale = it
            }
        }
    )