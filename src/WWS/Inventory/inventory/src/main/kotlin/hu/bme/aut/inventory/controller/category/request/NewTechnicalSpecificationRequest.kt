package hu.bme.aut.inventory.controller.category.request

import hu.bme.aut.inventory.controller.common.annotation.Trim
import hu.bme.aut.inventory.domain.technicalSpecification.BooleanTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.EnumListTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.NumberTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.StringTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecification
import javax.validation.constraints.NotBlank

data class NewTechnicalSpecificationRequest(
    @field:[Trim NotBlank]
    val name: String,
    val unitOfMeasure: String?,
    val isNumber: Boolean,
    val isBoolean: Boolean,
    val isString: Boolean,
    val isEnumList: Boolean,
    val listOfEnumNames: List<String>
) {
    fun toNew(categoryId: Long): TechnicalSpecification =
        when {
            isNumber -> NumberTechnicalSpecification(null, name, unitOfMeasure, categoryId)
            isBoolean -> BooleanTechnicalSpecification(null, name, unitOfMeasure, categoryId)
            isEnumList -> EnumListTechnicalSpecification(null, name, unitOfMeasure, categoryId, mutableListOf())
            else -> StringTechnicalSpecification(null, name, unitOfMeasure, categoryId)
        }
}