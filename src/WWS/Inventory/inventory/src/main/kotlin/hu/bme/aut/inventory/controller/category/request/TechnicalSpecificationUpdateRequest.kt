package hu.bme.aut.inventory.controller.category.request

import hu.bme.aut.inventory.controller.common.annotation.Trim
import hu.bme.aut.inventory.domain.technicalSpecification.BooleanTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.EnumListTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.NumberTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.StringTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecification
import javax.validation.constraints.NotBlank

data class TechnicalSpecificationUpdateRequest(
    val id: Long?,
    @field:[Trim NotBlank]
    val name: String,
    val unitOfMeasure: String?,
    val categoryId: Long,
    val isNumber: Boolean,
    val isBoolean: Boolean,
    val isString: Boolean,
    val isEnumList: Boolean,
    val listOfEnumItems: List<TechnicalSpecEnumListItemRequest>
) {
    fun to(categoryId: Long): TechnicalSpecification =
        when {
            isNumber -> NumberTechnicalSpecification(id, name, unitOfMeasure, categoryId)
            isBoolean -> BooleanTechnicalSpecification(id, name, unitOfMeasure, categoryId)
            isEnumList -> EnumListTechnicalSpecification(
                id,
                name,
                unitOfMeasure,
                categoryId, enumList = listOfEnumItems.map { it.to() }.toMutableList()
            )
            else -> StringTechnicalSpecification(id, name, unitOfMeasure, categoryId)
        }
}