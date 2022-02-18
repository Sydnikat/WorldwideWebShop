package hu.bme.aut.inventory.domain

data class TechnicalSpecification(
    val id: Long?,
    val name: String,
    val unitOfMeasure: String?,
    val categoryId: Long,
    val isNumber: Boolean,
    val isBoolean: Boolean,
    val isString: Boolean,
    val isEnumList: Boolean,
    val enumList: MutableList<TechnicalSpecEnumListItem>
)
