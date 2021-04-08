package hu.bme.aut.inventory.controller.item.request

import hu.bme.aut.inventory.controller.common.annotation.Trim
import javax.validation.constraints.NotBlank

data class NewItemRequest(
    @field:[Trim NotBlank]
    val name: String,

    @field:[Trim NotBlank]
    val description: String
)