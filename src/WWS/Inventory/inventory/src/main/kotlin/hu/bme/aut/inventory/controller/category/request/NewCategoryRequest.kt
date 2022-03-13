package hu.bme.aut.inventory.controller.category.request

import hu.bme.aut.inventory.controller.common.annotation.Trim
import hu.bme.aut.inventory.domain.category.Category
import javax.validation.Valid
import javax.validation.constraints.NotBlank

data class NewCategoryRequest(
    @field:[Trim NotBlank]
    val name: String,
    @field:Valid
    val technicalSpecificationRequests: List<NewTechnicalSpecificationRequest>
) {
    fun toNew() = Category(
        id = null,
        name = name,
        technicalSpecifications = mutableListOf()
    )
}
