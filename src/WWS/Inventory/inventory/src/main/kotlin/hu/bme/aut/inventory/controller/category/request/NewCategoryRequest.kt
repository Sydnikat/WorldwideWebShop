package hu.bme.aut.inventory.controller.category.request

import hu.bme.aut.inventory.controller.common.annotation.Trim
import hu.bme.aut.inventory.dal.Category
import javax.validation.constraints.NotBlank

data class NewCategoryRequest(
    @field:[Trim NotBlank]
    val name: String
) {
    fun toNew() = Category(
        id = null,
        name = name
    )
}
