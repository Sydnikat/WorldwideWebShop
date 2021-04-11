package hu.bme.aut.inventory.controller.item

import hu.bme.aut.inventory.controller.item.request.UpdateItemRequest
import hu.bme.aut.inventory.controller.item.response.ItemResponse
import hu.bme.aut.inventory.controller.review.request.NewReviewRequest
import hu.bme.aut.inventory.controller.review.response.ReviewResponse
import hu.bme.aut.inventory.exception.RequestError
import hu.bme.aut.inventory.service.item.ItemService
import hu.bme.aut.inventory.service.item.exception.RatingOutOfRangeException
import hu.bme.aut.inventory.service.review.ReviewService
import hu.bme.aut.inventory.util.requestError
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactive.awaitSingle
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

@RestController
@RequestMapping("/api/items")
class ItemController(
    private val itemService: ItemService,
    private val reviewService: ReviewService
) {
    @GetMapping("{id}")
    suspend fun getItem(
        @PathVariable
        id: Long
    ): ResponseEntity<ItemResponse> {
        val item = itemService.getItem(id).awaitFirst()
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(ItemResponse.of(item))
    }

    @GetMapping
    suspend fun getItems(
        @RequestParam(required = false)
        offset: Int?,
        @RequestParam(required = false)
        size: Int?
    ): ResponseEntity<List<ItemResponse>> {
        val pageable = PageRequest.of(offset ?: 0, size ?: 20)
        return ResponseEntity.ok(
            itemService.getItems(pageable)
                .asFlow()
                .toList()
                .map { ItemResponse.of(it) }
        )
    }

    @PutMapping("{id}")
    suspend fun updateItem(
        @PathVariable
        id: Long,
        @RequestBody @Valid
        request: UpdateItemRequest
    ): ResponseEntity<ItemResponse> {
        val item = itemService.getItem(id).awaitFirst()
            ?: return ResponseEntity.notFound().build()

        val updatedItem = itemService.updateItem(item, request.toPatchData()).awaitSingle()

        return ResponseEntity.ok(ItemResponse.of(updatedItem))
    }

    @PostMapping("{id}/reviews")
    suspend fun addReview(
        @PathVariable
        id: Long,
        @RequestBody @Valid
        request: NewReviewRequest
    ): ResponseEntity<ReviewResponse> {
        val item = itemService.getItem(id).awaitFirst()
            ?: return ResponseEntity.notFound().build()

        try {
            val savedReview = itemService.saveNewReview(
                item = item,
                reviewerId = request.reviewerId,
                reviewerName = request.reviewerName,
                summary = request.summary,
                rating = request.rating
            ).awaitSingle()

            return ResponseEntity.ok(ReviewResponse.of(savedReview))
        } catch (e: RatingOutOfRangeException) {
            requestError(
                RequestError.RATING_VALUE_MUST_BE_VALID,
                HttpStatus.BAD_REQUEST,
                "rating value" to e.ratingValue
            )
        }
    }

    @GetMapping("{id}/reviews")
    suspend fun getReviews(
        @PathVariable
        id: Long,
        @RequestParam(required = false)
        offset: Int?,
        @RequestParam(required = false)
        size: Int?
    ): ResponseEntity<List<ReviewResponse>> {
        val item = itemService.getItem(id).awaitFirst()
            ?: return ResponseEntity.notFound().build()

        val pageable = PageRequest.of(offset ?: 0, size ?: 5)

        val reviews = reviewService.getReviewsOfItem(item, pageable)
            .asFlow()
            .toList()

        return ResponseEntity.ok(
            reviews.map { ReviewResponse.of(it) }
        )
    }

    @DeleteMapping("{id}")
    suspend fun deleteDiscount(
        @PathVariable
        id: Long
    ) {
        val item = itemService.getItem(id).awaitFirstOrNull()
            ?: return

        itemService.deleteItem(item = item)
    }
}