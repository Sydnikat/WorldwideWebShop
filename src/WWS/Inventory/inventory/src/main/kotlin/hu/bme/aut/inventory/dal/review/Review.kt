package hu.bme.aut.inventory.dal.review

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDate

@Table
data class Review(
    @Id @Column("ReviewID")
    var id: Long?,
    @Column("ItemID")
    val itemId: Long,
    @Column("ReviewerName")
    val reviewerName: String,
    @Column("ReviewerID")
    val reviewerId: String,
    @Column("Summary")
    var summary: String,
    @Column("Rating")
    var rating: Float,
    @Column("Created")
    var created: LocalDate
) {
    fun toDomain(): hu.bme.aut.inventory.domain.Review =
        hu.bme.aut.inventory.domain.Review(
            id = id,
            itemId = itemId,
            reviewerName = reviewerName,
            reviewerId = reviewerId,
            summary = summary,
            rating = rating,
            created = created
        )

    companion object {
        fun toDal(review: hu.bme.aut.inventory.domain.Review): Review = review.let {
            Review(
                id = it.id,
                itemId = it.itemId,
                reviewerName = it.reviewerName,
                reviewerId = it.reviewerId,
                summary = it.summary,
                rating = it.rating,
                created = it.created
            )
        }
    }
}
