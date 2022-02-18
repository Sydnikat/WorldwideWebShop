package hu.bme.aut.inventory.controller.item.response

import hu.bme.aut.inventory.domain.TechnicalSpecInfo

data class TechnicalSpecInfoResponse(
    val id: Long,
    val technicalSpecificationId: Long,
    val itemId: Long,
    val value: String
) {
    companion object {
        fun of(specInfo: TechnicalSpecInfo): TechnicalSpecInfoResponse =
            TechnicalSpecInfoResponse(
                id = specInfo.id!!,
                technicalSpecificationId = specInfo.technicalSpecificationId,
                itemId = specInfo.itemId,
                value = specInfo.value
            )
    }
}
