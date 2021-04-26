package hu.bme.aut.inventory.service.review

import hu.bme.aut.inventory.dal.Item
import hu.bme.aut.inventory.dal.ItemRepository
import hu.bme.aut.inventory.dal.Review
import hu.bme.aut.inventory.dal.ReviewRepository
import hu.bme.aut.inventory.util.decreaseRating
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactive.awaitSingleOrNull
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class ReviewService(
    private val reviewRepository: ReviewRepository,
    private val itemRepository: ItemRepository
) {
    suspend fun getReview(reviewId: Long): Mono<Review?> =
        reviewRepository.findById(reviewId)

    suspend fun getReviews(pageable: Pageable = Pageable.unpaged()): Flux<Review> =
        reviewRepository.findAllByIdNotNull(pageable)

    suspend fun getReviews(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): Flux<Review> =
        reviewRepository.findAllByIdIn(ids = ids, pageable = pageable)

    suspend fun saveReview(review: Review): Mono<Review> =
        reviewRepository.save(review)

    suspend fun getReviewsOfItem(item: Item, pageable: Pageable = Pageable.unpaged()): Flux<Review> =
        reviewRepository.findAllByItemId(item.id!!)

    suspend fun deleteReview(review: Review) {
        val item = itemRepository.findById(review.itemId)
            .awaitFirstOrNull()

        if (item != null) {
            item.decreaseRating(review.rating.toInt())
            itemRepository.save(item).subscribe()
        }

        reviewRepository.delete(review).awaitSingleOrNull()
    }
}