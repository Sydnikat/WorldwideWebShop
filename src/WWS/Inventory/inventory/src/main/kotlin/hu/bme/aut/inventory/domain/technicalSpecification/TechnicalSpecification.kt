package hu.bme.aut.inventory.domain.technicalSpecification

abstract class TechnicalSpecification(
    val id: Long?,
    val name: String,
    val unitOfMeasure: String?,
    val categoryId: Long
) {
    abstract fun checkValue(valueStr: String): Boolean
}
