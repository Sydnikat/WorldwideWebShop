package hu.bme.aut.inventory.controller.discount.response

import hu.bme.aut.inventory.domain.discount.Discount

data class DiscountResponse(
    val id: Long,
    val value: Int,
    val startDate: String,
    val endDate: String,
    val expired: Boolean,
    val categoryId: Long?
) {
    companion object {
        fun of(discount: Discount): DiscountResponse = discount.run {
            DiscountResponse(
                id = id!!,
                value = value,
                startDate = startDate.toString(),
                endDate = endDate.toString(),
                expired = expired,
                categoryId = categoryId
            )
        }
    }
}
