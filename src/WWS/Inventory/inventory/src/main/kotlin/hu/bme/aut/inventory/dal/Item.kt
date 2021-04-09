package hu.bme.aut.inventory.dal

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
    @Column("Stock")
    var stock: Int = 0,
    @Column("LowLevel")
    var lowLevel: Int = 0
)
