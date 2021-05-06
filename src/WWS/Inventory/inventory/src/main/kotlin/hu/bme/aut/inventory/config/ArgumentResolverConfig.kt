package hu.bme.aut.inventory.config

import hu.bme.aut.inventory.config.resolver.ReactiveJwtArgumentResolver
import org.springframework.context.annotation.Configuration
import org.springframework.web.reactive.config.DelegatingWebFluxConfiguration
import org.springframework.web.reactive.result.method.annotation.ArgumentResolverConfigurer
import org.springframework.web.server.i18n.AcceptHeaderLocaleContextResolver
import java.util.Locale

@Configuration
class ArgumentResolverConfig() : DelegatingWebFluxConfiguration() {

    override fun configureArgumentResolvers(configurer: ArgumentResolverConfigurer) {
        configurer.addCustomResolver(ReactiveJwtArgumentResolver())
    }

    override fun createLocaleContextResolver() =
        AcceptHeaderLocaleContextResolver().apply { defaultLocale = Locale.getDefault() }
}