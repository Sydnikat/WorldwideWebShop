package hu.bme.aut.inventory.controller.category.response

import hu.bme.aut.inventory.dal.Category

data class CategoryResponse(
    val id: Long,
    val name: String
) {
    companion object {
        fun of(category: Category) = category.run {
            CategoryResponse(
                id = id!!,
                name = name
            )
        }
    }
}