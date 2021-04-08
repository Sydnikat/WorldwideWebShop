package hu.bme.aut.inventory.util

import hu.bme.aut.inventory.exception.RequestError
import hu.bme.aut.inventory.exception.RequestErrorException
import org.springframework.http.HttpStatus

fun requestError(requestError: RequestError, status: HttpStatus, vararg params: Pair<String, Any?>): Nothing =
    throw RequestErrorException(requestError, status, mapOf(*params))