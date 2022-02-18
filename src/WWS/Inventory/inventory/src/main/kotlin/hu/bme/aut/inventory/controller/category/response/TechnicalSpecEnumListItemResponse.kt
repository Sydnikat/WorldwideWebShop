package hu.bme.aut.inventory.controller.category.response

import hu.bme.aut.inventory.domain.TechnicalSpecEnumListItem

data class TechnicalSpecEnumListItemResponse(
    val id: Long,
    val enumName: String,
    val technicalSpecificationId: Long
) {
    companion object {
        fun of(techSpecEnumListItem: TechnicalSpecEnumListItem): TechnicalSpecEnumListItemResponse =
            TechnicalSpecEnumListItemResponse(
                id = techSpecEnumListItem.id!!,
                enumName = techSpecEnumListItem.enumName,
                technicalSpecificationId = techSpecEnumListItem.technicalSpecificationId
            )
    }
}
