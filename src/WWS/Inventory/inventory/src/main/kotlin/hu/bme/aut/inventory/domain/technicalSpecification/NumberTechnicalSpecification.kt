package hu.bme.aut.inventory.domain.technicalSpecification

class NumberTechnicalSpecification(
    id: Long?,
    name: String,
    unitOfMeasure: String?,
    categoryId: Long
) : TechnicalSpecification(id, name, unitOfMeasure, categoryId) {

    override fun checkValue(valueStr: String): Boolean {
        return try {
            valueStr.toInt()
            true
        } catch (e: NumberFormatException) {
            false
        }
    }
}