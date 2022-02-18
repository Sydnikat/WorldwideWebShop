package hu.bme.aut.inventory.domain

data class Category(
    val id: Long?,
    val name: String,
    val technicalSpecifications: MutableList<TechnicalSpecification>
)
