package hu.bme.aut.inventory.controller.item.request

import hu.bme.aut.inventory.controller.common.annotation.Trim
import hu.bme.aut.inventory.domain.item.Item
import java.time.LocalDate
import javax.validation.Valid
import javax.validation.constraints.NotBlank
import javax.validation.constraints.PositiveOrZero

data class UpdateItemRequest(
    @field:[Trim NotBlank]
    val description: String,

    @field:[PositiveOrZero]
    val stock: Int,

    @field:[PositiveOrZero]
    val lowLevel: Int,

    @field:Valid
    val listOfTechnicalSpecInfo: List<TechnicalSpecInfoRequest>
) {
    fun toPatchData(itemId: Long) = Item(
        id = null,
        categoryId = -1,
        name = "",
        description = description,
        discountId = null,
        discount = null,
        rating = null,
        ratingCount = 0,
        created = LocalDate.now(),
        price = 0.0F,
        stock = stock,
        lowLevel = lowLevel,
        reviews = listOf(),
        listOfTechnicalSpecInfo = listOfTechnicalSpecInfo.map { it.to(itemId) }
    )
}



