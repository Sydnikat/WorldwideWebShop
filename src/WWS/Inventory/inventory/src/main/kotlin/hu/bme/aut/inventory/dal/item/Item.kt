package hu.bme.aut.inventory.dal.item

import hu.bme.aut.inventory.domain.review.Review
import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecInfo
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDate

@Table
data class Item(
    @Id @Column("ItemID")
    var id: Long?,
    @Column("CategoryID")
    val categoryId: Long,
    @Column("Name")
    val name: String,
    @Column("Description")
    var description: String,
    @Column("DiscountID")
    var discountId: Long?,
    @Column("Discount")
    var discount: Long?,
    @Column("Rating")
    var rating: Float?,
    @Column("RatingCount")
    var ratingCount: Int = 0,
    @Column("Created")
    var created: LocalDate,
    @Column("Price")
    var price: Float,
    @Column("Stock")
    var stock: Int = 0,
    @Column("LowLevel")
    var lowLevel: Int = 0
) {
    fun toDomain(
        reviews: List<Review>? = null,
        listOfSpecInfo: List<TechnicalSpecInfo> = listOf()
    ): hu.bme.aut.inventory.domain.item.Item =
        hu.bme.aut.inventory.domain.item.Item(
            id,
            categoryId,
            name,
            description,
            discountId,
            discount,
            rating,
            ratingCount,
            created,
            price,
            stock,
            lowLevel,
            reviews = reviews ?: listOf(),
            listOfTechnicalSpecInfo = listOfSpecInfo
        )

    companion object {
        fun toDal(item: hu.bme.aut.inventory.domain.item.Item): Item = item.let {
            Item(
                it.id,
                it.categoryId,
                it.name,
                it.description,
                it.discountId,
                it.discount,
                it.rating,
                it.ratingCount,
                it.created,
                it.price,
                it.stock,
                it.lowLevel
            )
        }
    }
}
