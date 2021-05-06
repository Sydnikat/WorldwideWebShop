package hu.bme.aut.inventory.config.resolver

import com.auth0.jwt.JWT
import com.auth0.jwt.exceptions.JWTDecodeException
import hu.bme.aut.inventory.exception.RequestError
import hu.bme.aut.inventory.util.requestError
import kotlinx.coroutines.reactor.mono
import org.springframework.core.MethodParameter
import org.springframework.core.annotation.AnnotationUtils
import org.springframework.http.HttpStatus
import org.springframework.web.reactive.BindingContext
import org.springframework.web.reactive.result.method.HandlerMethodArgumentResolver
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono


class ReactiveJwtArgumentResolver() : HandlerMethodArgumentResolver {
    override fun supportsParameter(parameter: MethodParameter): Boolean {
        return findMethodAnnotation(WWSUserMetaData::class.java, parameter) != null
    }

    override fun resolveArgument(
        parameter: MethodParameter,
        bindingContext: BindingContext,
        exchange: ServerWebExchange
    ) = mono<Any> {
        val token = exchange.request.headers["Authorization"]?.first()?.split(" ")?.last()
            ?: requestError(RequestError.UNAUTHORIZED, HttpStatus.UNAUTHORIZED)

        try {
            val claims = JWT.decode(token).claims
            val user = UserMetaData(
                userName = claims["sub"]!!.asString(),
                fullName = claims["FullName"]!!.asString(),
                userId = claims["Id"]!!.asString(),
                roles = claims["Roles"]!!.asString().split(" ")
            )
            exchange.attributes[WWSUserMetaData::class.simpleName] = user
            user
        } catch (exception: JWTDecodeException) {
            requestError(RequestError.MALFORMED_JWT, HttpStatus.UNAUTHORIZED)
        }
    }

    private fun <T : Annotation> findMethodAnnotation(
        annotationClass: Class<T>,
        parameter: MethodParameter
    ): T? {
        var annotation = parameter.getParameterAnnotation(annotationClass)
        if (annotation != null) {
            return annotation
        }
        val annotationsToSearch: Array<Annotation> = parameter.parameterAnnotations
        for (toSearch in annotationsToSearch) {
            annotation = AnnotationUtils.findAnnotation(
                toSearch.annotationClass::class.java,
                annotationClass
            )
            if (annotation != null) {
                return annotation
            }
        }
        return null
    }
}

@Retention(AnnotationRetention.RUNTIME)
@Target(
    AnnotationTarget.VALUE_PARAMETER,
    AnnotationTarget.ANNOTATION_CLASS
)
annotation class WWSUserMetaData