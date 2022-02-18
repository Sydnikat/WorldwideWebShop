package hu.bme.aut.inventory.domain

data class TechnicalSpecInfo(
    val id: Long?,
    val technicalSpecificationId: Long,
    val itemId: Long,
    val value: String,
)
