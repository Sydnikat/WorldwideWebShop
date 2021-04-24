package hu.bme.aut.inventory.controller.item.response

import hu.bme.aut.inventory.dal.Item

data class ItemResponse(
    val id: Long,
    val categoryId: Long,
    val name: String,
    val description: String,
    val discountId: Long?,
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
            ItemResponse(
                id = id!!,
                categoryId = categoryId,
                name = name,
                description = description,
                discountId = discountId,
                rating = rating,
                ratingCount = ratingCount,
                created = created.toString(),
                price = if(discount != null) price * ((100 - discount) / 100.0F) else price,
                originalPrice = price,
                stock = stock,
                lowLevel = lowLevel
            )
        }
    }
}