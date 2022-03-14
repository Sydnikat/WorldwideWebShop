package hu.bme.aut.inventory.controller.category.request

import hu.bme.aut.inventory.controller.common.annotation.Trim
import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecEnumListItem
import javax.validation.constraints.NotBlank

data class TechnicalSpecEnumListItemRequest(
    val id: Long?,
    @field:[Trim NotBlank]
    val enumName: String,
    val technicalSpecificationId: Long?
) {
    fun to(): TechnicalSpecEnumListItem =
        TechnicalSpecEnumListItem(
            id = id,
            enumName = enumName,
            technicalSpecificationId = technicalSpecificationId!!
        )
}