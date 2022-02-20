package hu.bme.aut.inventory.domain.category

import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecification

data class Category(
    val id: Long?,
    val name: String,
    val technicalSpecifications: MutableList<TechnicalSpecification>
)
