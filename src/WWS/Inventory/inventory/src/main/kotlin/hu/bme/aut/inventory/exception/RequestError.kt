package hu.bme.aut.inventory.exception

enum class RequestError {
    RATING_VALUE_MUST_BE_VALID,
    DISCOUNT_VALUE_MUST_BE_VALID,
    DISCOUNT_END_DATE_MUST_BE_FUTURE_DATE
}