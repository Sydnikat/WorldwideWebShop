package hu.bme.aut.inventory.domain.technicalSpecification

class EnumListTechnicalSpecification(
    id: Long?,
    name: String,
    unitOfMeasure: String?,
    categoryId: Long,
    val enumList: MutableList<TechnicalSpecEnumListItem>
) : TechnicalSpecification(id, name, unitOfMeasure, categoryId) {

    override fun checkValue(valueStr: String): Boolean = enumList.any { it.enumName == valueStr }
}