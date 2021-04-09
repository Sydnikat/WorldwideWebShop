package hu.bme.aut.inventory.controller.discount.request

import org.springframework.format.annotation.DateTimeFormat
import java.time.LocalDate
import javax.validation.constraints.PositiveOrZero

data class NewDiscountRequest(
    @field:[PositiveOrZero]
    val value: Int,

    @field:[DateTimeFormat(iso = DateTimeFormat.ISO.DATE)]
    val endDate: LocalDate,

    val categoryId: Long?,

    val itemIds: List<Long>?
)
