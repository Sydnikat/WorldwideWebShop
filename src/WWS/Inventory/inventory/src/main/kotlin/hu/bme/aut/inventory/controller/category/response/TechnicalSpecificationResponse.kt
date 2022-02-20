package hu.bme.aut.inventory.controller.category.response

import hu.bme.aut.inventory.domain.technicalSpecification.BooleanTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.EnumListTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.NumberTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.StringTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecification

data class TechnicalSpecificationResponse(
    val id: Long,
    val name: String,
    val unitOfMeasure: String?,
    val categoryId: Long,
    val isNumber: Boolean,
    val isBoolean: Boolean,
    val isString: Boolean,
    val isEnumList: Boolean,
    val listOfEnumItems: List<TechnicalSpecEnumListItemResponse>
) {
    companion object {
        fun of(technicalSpecification: TechnicalSpecification): TechnicalSpecificationResponse =
            TechnicalSpecificationResponse(
                id = technicalSpecification.id!!,
                name = technicalSpecification.name,
                unitOfMeasure = technicalSpecification.unitOfMeasure,
                categoryId = technicalSpecification.categoryId,
                isNumber = technicalSpecification is NumberTechnicalSpecification,
                isBoolean = technicalSpecification is BooleanTechnicalSpecification,
                isString = technicalSpecification is StringTechnicalSpecification,
                isEnumList = technicalSpecification is EnumListTechnicalSpecification,
                listOfEnumItems = when (technicalSpecification) {
                    is EnumListTechnicalSpecification ->
                        technicalSpecification.enumList.map { TechnicalSpecEnumListItemResponse.of(it) }
                    else -> listOf()
                }
            )
    }
}
