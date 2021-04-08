package hu.bme.aut.inventory.controller.review

import hu.bme.aut.inventory.controller.review.response.ReviewResponse
import hu.bme.aut.inventory.service.review.ReviewService
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirst
import org.springframework.data.domain.PageRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/reviews")
class ReviewController(
    private val reviewService: ReviewService
) {
    @GetMapping("{id}")
    suspend fun getReview(
        @PathVariable
        id: Long
    ): ResponseEntity<ReviewResponse> {
        val item = reviewService.getReview(id).awaitFirst()
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(ReviewResponse.of(item))
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
                .asFlow()
                .toList()
                .map { ReviewResponse.of(it) }
        )
    }
}