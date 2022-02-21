package hu.bme.aut.inventory.controller.item.response

import hu.bme.aut.inventory.domain.item.ItemQueryResult
import kotlin.math.roundToLong

data class ItemQueryResultResponse(
    val items: List<ItemResponse>,
    val maxPrice: Float,
    val minPrice: Float,
    val count: Int
) {
    companion object {
        fun of(result: ItemQueryResult): ItemQueryResultResponse = result.run {
            ItemQueryResultResponse(
                items = items.map { ItemResponse.of(it) },
                maxPrice = (maxPrice * 100.0F).roundToLong() / 100.0F,
                minPrice = (minPrice * 100.0F).roundToLong() / 100.0F,
                count = count
            )
        }
    }
}
