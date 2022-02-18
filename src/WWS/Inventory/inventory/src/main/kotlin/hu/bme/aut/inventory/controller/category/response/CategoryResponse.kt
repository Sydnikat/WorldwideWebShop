package hu.bme.aut.inventory.controller.category.response

import hu.bme.aut.inventory.domain.Category

data class CategoryResponse(
    val id: Long,
    val name: String,
    val technicalSpecifications: List<TechnicalSpecificationResponse>
) {
    companion object {
        fun of(category: Category) = category.run {
            CategoryResponse(
                id = id!!,
                name = name,
                technicalSpecifications = technicalSpecifications.map { TechnicalSpecificationResponse.of(it) }
            )
        }
    }
}