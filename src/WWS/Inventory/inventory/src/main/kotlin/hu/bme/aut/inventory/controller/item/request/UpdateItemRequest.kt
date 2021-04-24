package hu.bme.aut.inventory.controller.item.request

import hu.bme.aut.inventory.controller.common.annotation.Trim
import hu.bme.aut.inventory.dal.Item
import java.time.LocalDate
import javax.validation.constraints.NotBlank
import javax.validation.constraints.PositiveOrZero

data class UpdateItemRequest(
    @field:[Trim NotBlank]
    val description: String,

    @field:[PositiveOrZero]
    val stock: Int,

    @field:[PositiveOrZero]
    val lowLevel: Int
) {
    fun toPatchData() = Item(
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
        lowLevel = lowLevel
    )
}



