package hu.bme.aut.inventory.controller.review.response

import hu.bme.aut.inventory.domain.review.Review

data class ReviewResponse(
    val id: Long,
    val itemId: Long,
    val reviewerName: String,
    val reviewerId: String,
    val summary: String,
    val rating: Int,
    val created: String
) {
    companion object {
        fun of(review: Review): ReviewResponse = review.run {
            ReviewResponse(
                id = id!!,
                itemId = itemId,
                reviewerName = reviewerName,
                reviewerId = reviewerId,
                summary = summary,
                rating = rating.toInt(),
                created = created.toString()
            )
        }
    }
}