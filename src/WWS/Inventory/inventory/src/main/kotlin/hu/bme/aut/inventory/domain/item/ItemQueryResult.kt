package hu.bme.aut.inventory.domain.item

data class ItemQueryResult(
    val items: List<Item>,
    val maxPrice: Float,
    val minPrice: Float,
    val count: Int
)
