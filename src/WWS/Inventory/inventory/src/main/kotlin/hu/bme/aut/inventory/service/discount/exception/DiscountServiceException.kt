package hu.bme.aut.inventory.service.discount.exception

import java.time.LocalDate

class DiscountOutOfRangeException(val value: Int) : Exception()

class EndDateMustBeFutureDateException(val date: LocalDate) : Exception()