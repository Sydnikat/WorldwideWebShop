package hu.bme.aut.inventory.controller.review

import hu.bme.aut.inventory.config.resolver.UserMetaData
import hu.bme.aut.inventory.config.resolver.WWSUserMetaData
import hu.bme.aut.inventory.controller.review.response.ReviewResponse
import hu.bme.aut.inventory.exception.RequestError
import hu.bme.aut.inventory.service.auth.AuthManager
import hu.bme.aut.inventory.service.review.ReviewService
import hu.bme.aut.inventory.util.requestError
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/inventory/reviews")
class ReviewController(
    private val reviewService: ReviewService
) {
    @GetMapping("{id}")
    suspend fun getReview(
        @PathVariable
        id: Long
    ): ResponseEntity<ReviewResponse> {
        val review = reviewService.getReview(id)
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(ReviewResponse.of(review))
    }

    @GetMapping
    suspend fun getReviews(
        @RequestParam(required = false)
        offset: Int?,
        @RequestParam(required = false)
        size: Int?
    ): ResponseEntity<List<ReviewResponse>> {
        val pageable = PageRequest.of(offset ?: 0, size ?: 20)
        return ResponseEntity.ok(
            reviewService.getReviews(pageable)
                .map { ReviewResponse.of(it) }
        )
    }

    @DeleteMapping("{id}")
    suspend fun deleteReview(
        @WWSUserMetaData
        user: UserMetaData,
        @PathVariable
        id: Long
    ) {
        val review = reviewService.getReview(reviewId = id)
            ?: return

        if (review.reviewerId != user.userId) {
            requestError(RequestError.CANNOT_ACCESS_REQUESTED_RESOURCE, HttpStatus.FORBIDDEN)
        }

        reviewService.deleteReview(review = review)
    }
}