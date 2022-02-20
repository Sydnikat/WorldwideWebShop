package hu.bme.aut.inventory.domain.technicalSpecification

class StringTechnicalSpecification(
    id: Long?,
    name: String,
    unitOfMeasure: String?,
    categoryId: Long
) : TechnicalSpecification(id, name, unitOfMeasure, categoryId) {

    override fun checkValue(valueStr: String): Boolean = true
}