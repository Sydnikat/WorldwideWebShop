package hu.bme.aut.inventory.controller.item.request

import hu.bme.aut.inventory.controller.common.annotation.Trim
import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecInfo
import javax.validation.constraints.NotBlank

data class TechnicalSpecInfoRequest(
    val id: Long?,
    val technicalSpecificationId: Long,
    @field:[Trim NotBlank]
    val value: String
) {
    fun to(itemId: Long): TechnicalSpecInfo =
        TechnicalSpecInfo(
            id = id,
            technicalSpecificationId = technicalSpecificationId,
            itemId = itemId,
            value = value
        )
}