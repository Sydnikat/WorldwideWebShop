package hu.bme.aut.inventory.service.review

import hu.bme.aut.inventory.domain.Item
import hu.bme.aut.inventory.dal.item.ItemRepository
import hu.bme.aut.inventory.domain.Review
import hu.bme.aut.inventory.dal.review.ReviewRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class ReviewService(
    private val reviewRepository: ReviewRepository,
    private val itemRepository: ItemRepository
) {
    suspend fun getReview(reviewId: Long): Review? =
        reviewRepository.findById(reviewId)

    suspend fun getReviews(pageable: Pageable = Pageable.unpaged()): List<Review> =
        reviewRepository.findAllByIdNotNull(pageable)

    suspend fun getReviews(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): List<Review> =
        reviewRepository.findAllByIdIn(ids = ids, pageable = pageable)

    suspend fun saveReview(review: Review): Review =
        reviewRepository.save(review)

    suspend fun getReviewsOfItem(item: Item, pageable: Pageable = Pageable.unpaged()): List<Review> =
        reviewRepository.findAllByItemId(item.id!!)

    suspend fun deleteReview(review: Review) {
        val item = itemRepository.findById(review.itemId)

        if (item != null) {
            item.decreaseRating(review.rating.toInt())
            itemRepository.save(item)
        }

        reviewRepository.delete(review)
    }
}