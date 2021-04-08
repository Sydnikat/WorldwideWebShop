package hu.bme.aut.inventory.exception

import org.springframework.http.HttpStatus

class RequestErrorException(
    val error: RequestError,
    val statusCode: HttpStatus,
    val params: Map<String, Any?>
) : Exception()