package hu.bme.aut.inventory.domain

import java.time.LocalDate

data class Discount(
    val id: Long?,
    val value: Int,
    val startDate: LocalDate,
    val endDate: LocalDate,
    var expired: Boolean,
    val categoryId: Long?,
)
