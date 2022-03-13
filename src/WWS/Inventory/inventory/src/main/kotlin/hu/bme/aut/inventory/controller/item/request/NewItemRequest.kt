package hu.bme.aut.inventory.controller.item.request

import hu.bme.aut.inventory.controller.common.annotation.Trim
import hu.bme.aut.inventory.domain.item.Item
import java.time.LocalDate
import javax.validation.Valid
import javax.validation.constraints.NotBlank
import javax.validation.constraints.PositiveOrZero

data class NewItemRequest(
    @field:[Trim NotBlank]
    val name: String,

    @field:[Trim NotBlank]
    val description: String,

    @field:PositiveOrZero
    val price: Float,

    @field:Valid
    val listOfTechnicalSpecInfo: List<TechnicalSpecInfoRequest>
) {
    fun toNew(categoryId: Long): Item =
        Item(
            id = null,
            categoryId = categoryId,
            name = name,
            description = description,
            discountId = null,
            discount = null,
            rating = null,
            ratingCount = 0,
            created = LocalDate.now(),
            price = price,
            stock = 0,
            lowLevel = 0,
            reviews = listOf(),
            listOfTechnicalSpecInfo = listOf()
        )
}