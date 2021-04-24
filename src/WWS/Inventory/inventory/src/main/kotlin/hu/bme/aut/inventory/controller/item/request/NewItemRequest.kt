package hu.bme.aut.inventory.controller.item.request

import hu.bme.aut.inventory.controller.common.annotation.Trim
import javax.validation.constraints.NotBlank
import javax.validation.constraints.PositiveOrZero

data class NewItemRequest(
    @field:[Trim NotBlank]
    val name: String,

    @field:[Trim NotBlank]
    val description: String,

    @field:PositiveOrZero
    val price: Float
)