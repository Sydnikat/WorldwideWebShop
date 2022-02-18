package hu.bme.aut.inventory.controller.category.response

import hu.bme.aut.inventory.domain.TechnicalSpecification

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
                isNumber = technicalSpecification.isNumber,
                isBoolean = technicalSpecification.isBoolean,
                isString = technicalSpecification.isString,
                isEnumList = technicalSpecification.isEnumList,
                listOfEnumItems = technicalSpecification.enumList.map { TechnicalSpecEnumListItemResponse.of(it) }
            )
    }
}
