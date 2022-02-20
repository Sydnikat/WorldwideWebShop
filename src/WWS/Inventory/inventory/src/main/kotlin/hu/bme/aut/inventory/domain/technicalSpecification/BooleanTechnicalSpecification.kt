package hu.bme.aut.inventory.domain.technicalSpecification

class BooleanTechnicalSpecification(
    id: Long?,
    name: String,
    unitOfMeasure: String?,
    categoryId: Long
) : TechnicalSpecification(id, name, unitOfMeasure, categoryId) {

    override fun checkValue(valueStr: String): Boolean {
        return valueStr == "True" || valueStr == "False"
    }
}