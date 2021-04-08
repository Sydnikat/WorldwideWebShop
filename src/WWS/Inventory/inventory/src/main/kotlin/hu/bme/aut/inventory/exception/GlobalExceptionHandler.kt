package hu.bme.aut.inventory.exception

import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.MessageSource
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseBody
import java.util.Locale

@ControllerAdvice
class GlobalExceptionHandler(
    @Qualifier("utf8MessageSource")
    private val messageSource: MessageSource
) {
    inner class RequestErrorDTO(val id: String, val message: String)

    @ExceptionHandler(RequestErrorException::class)
    @ResponseBody
    protected fun handleRequestError(ex: RequestErrorException, locale: Locale): ResponseEntity<RequestErrorDTO> {
        val errorId = ex.error.name
        val message = messageSource.getMessage("request_error.$errorId", emptyArray(), Locale("hu"))
        return ResponseEntity(RequestErrorDTO(errorId, message), ex.statusCode)
    }
}