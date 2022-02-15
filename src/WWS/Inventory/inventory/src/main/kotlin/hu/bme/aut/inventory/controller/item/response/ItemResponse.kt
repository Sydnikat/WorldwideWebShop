package hu.bme.aut.inventory.controller.item.response

import hu.bme.aut.inventory.dal.Item
import kotlin.math.roundToLong

data class ItemResponse(
    val id: Long,
    val categoryId: Long,
    val name: String,
    val description: String,
    val discountId: Long?,
    val discount: Long?,
    val rating: Float?,
    val ratingCount: Int,
    val created: String,
    val price: Float,
    val originalPrice: Float,
    val stock: Int,
    val lowLevel: Int
) {
    companion object {
        fun of(item: Item): ItemResponse = item.run {
            val discount = item.discount
            val shownPrice = if(discount != null) price * ((100 - discount) / 100.0F) else price
            ItemResponse(
                id = id!!,
                categoryId = categoryId,
                name = name,
                description = description,
                discountId = discountId,
                discount = discount,
                rating = rating,
                ratingCount = ratingCount,
                created = created.toString(),
                price = (shownPrice * 100.0F).roundToLong() / 100.0F,
                originalPrice = price,
                stock = stock,
                lowLevel = lowLevel
            )
        }
    }
}