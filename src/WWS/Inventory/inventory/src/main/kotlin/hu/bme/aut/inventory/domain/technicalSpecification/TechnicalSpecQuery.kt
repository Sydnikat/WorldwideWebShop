package hu.bme.aut.inventory.domain.technicalSpecification

data class TechnicalSpecQuery(
    val technicalSpecificationId: Long,
    val value: String,
    val range: Pair<Long, Long>
)
