package hu.bme.aut.inventory.controller.item

import hu.bme.aut.inventory.config.resolver.UserMetaData
import hu.bme.aut.inventory.config.resolver.WWSUserMetaData
import hu.bme.aut.inventory.controller.item.request.TechnicalSpecInfoRequest
import hu.bme.aut.inventory.controller.item.request.UpdateItemRequest
import hu.bme.aut.inventory.controller.item.response.ItemQueryResultResponse
import hu.bme.aut.inventory.controller.item.response.ItemResponse
import hu.bme.aut.inventory.controller.review.request.NewReviewRequest
import hu.bme.aut.inventory.controller.review.response.ReviewResponse
import hu.bme.aut.inventory.exception.RequestError
import hu.bme.aut.inventory.service.auth.AuthManager
import hu.bme.aut.inventory.service.item.ItemService
import hu.bme.aut.inventory.service.item.SortingDirection
import hu.bme.aut.inventory.service.item.SortingType
import hu.bme.aut.inventory.service.item.exception.RatingOutOfRangeException
import hu.bme.aut.inventory.service.review.ReviewService
import hu.bme.aut.inventory.util.requestError
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
@RequestMapping("/api/inventory/items")
class ItemController(
    private val itemService: ItemService,
    private val reviewService: ReviewService,
    private val authManager: AuthManager
) {
    @GetMapping("{id}")
    suspend fun getItem(
        @PathVariable
        id: Long
    ): ResponseEntity<ItemResponse> {
        val item = itemService.getItem(id)
            ?: throw requestError(RequestError.ITEM_NOT_FOUND, HttpStatus.NOT_FOUND)

        return ResponseEntity.ok(ItemResponse.of(item))
    }

    @GetMapping("/search")
    suspend fun searchItems(
        @RequestParam(required = true)
        q: String = "",
        @RequestParam(required = false)
        cat: List<Long>?,
        @RequestParam(required = false)
        sort: String? = "",
        @RequestParam(required = false)
        sortBy: String? = "",
        @RequestParam(required = false)
        stock: Boolean = true,
        @RequestParam(required = false)
        price: List<Long>?,
        @RequestParam(required = false)
        specs: String?,
        @RequestParam(required = false)
        offset: Int?,
        @RequestParam(required = false)
        size: Int?
    ): ResponseEntity<ItemQueryResultResponse> {
        val pageable = PageRequest.of(offset ?: 0, size ?: 20)
        val sortingDirection = when (sort) {
            "asc" -> SortingDirection.ASC
            "desc" -> SortingDirection.DESC
            else -> SortingDirection.UNSORTED
        }
        val sortingBy = when (sortBy) {
            "price" -> SortingType.PRICE
            "score" -> SortingType.RATING
            else -> SortingType.UNSORTED
        }

        val requestedSpecs = if (specs != null) TechnicalSpecInfoRequest.toTechnicalSpecInfo(specs) else listOf()

        val result = itemService.searchItems(
            queryStr = q,
            sortBy = sortingBy,
            sort = sortingDirection,
            hasStock = stock,
            price = price ?: listOf(),
            categories = cat ?: listOf(),
            requestedSpecs = requestedSpecs,
            pageable = pageable
        )

        return ResponseEntity.ok(ItemQueryResultResponse.of(result))
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
                .map { ItemResponse.of(it) }
        )
    }

    @PutMapping("{id}")
    suspend fun updateItem(
        @WWSUserMetaData
        user: UserMetaData,
        @PathVariable
        id: Long,
        @RequestBody @Valid
        request: UpdateItemRequest
    ): ResponseEntity<ItemResponse> {
        if (!authManager.canManageResource(user)) {
            requestError(RequestError.CANNOT_ACCESS_REQUESTED_RESOURCE, HttpStatus.FORBIDDEN)
        }

        val item = itemService.getItem(id)
            ?: throw requestError(RequestError.ITEM_NOT_FOUND, HttpStatus.NOT_FOUND)

        val updatedItem = itemService.updateItem(item, request.toPatchData())

        return ResponseEntity.ok(ItemResponse.of(updatedItem))
    }

    @PostMapping("{id}/reviews")
    suspend fun addReview(
        @PathVariable
        id: Long,
        @RequestBody @Valid
        request: NewReviewRequest
    ): ResponseEntity<ReviewResponse> {
        val item = itemService.getItem(id)
            ?: throw requestError(RequestError.ITEM_NOT_FOUND, HttpStatus.NOT_FOUND)

        try {
            val savedReview = itemService.saveNewReview(
                item = item,
                reviewerId = request.reviewerId,
                reviewerName = request.reviewerName,
                summary = request.summary,
                rating = request.rating
            )

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
        val item = itemService.getItem(id)
            ?: throw requestError(RequestError.ITEM_NOT_FOUND, HttpStatus.NOT_FOUND)

        val pageable = PageRequest.of(offset ?: 0, size ?: 5)

        val reviews = reviewService.getReviewsOfItem(item, pageable)

        return ResponseEntity.ok(
            reviews.map { ReviewResponse.of(it) }
        )
    }

    @DeleteMapping("{id}")
    suspend fun deleteItem(
        @WWSUserMetaData
        user: UserMetaData,
        @PathVariable
        id: Long
    ) {
        if (!authManager.canManageResource(user)) {
            requestError(RequestError.CANNOT_ACCESS_REQUESTED_RESOURCE, HttpStatus.FORBIDDEN)
        }

        val item = itemService.getItem(id)
            ?: return

        itemService.deleteItem(item = item)
    }
}