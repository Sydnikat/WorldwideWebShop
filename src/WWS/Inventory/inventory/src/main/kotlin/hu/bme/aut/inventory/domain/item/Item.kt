package hu.bme.aut.inventory.domain.item
import hu.bme.aut.inventory.domain.review.Review
import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecInfo
import java.time.LocalDate

data class Item(
    val id: Long?,
    val categoryId: Long,
    val name: String,
    var description: String,
    var discountId: Long?,
    var discount: Long?,
    var rating: Float?,
    var ratingCount: Int = 0,
    val created: LocalDate,
    var price: Float,
    var stock: Int = 0,
    var lowLevel: Int = 0,
    val reviews: List<Review>,
    val listOfTechnicalSpecInfo: List<TechnicalSpecInfo>
) {
    fun increaseRating(rating: Int) {
        val newRating = (((this.rating ?: 0.0F) * ratingCount) + rating.toFloat()) / (ratingCount + 1)

        this.ratingCount += 1
        this.rating = newRating
    }

    fun decreaseRating(rating: Int) {
        val newRating = (((this.rating ?: 0.0F) * ratingCount) - rating.toFloat()) / (ratingCount - 1)

        this.ratingCount -= 1
        this.rating = newRating
    }
}
