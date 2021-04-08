package hu.bme.aut.inventory.service.item

import hu.bme.aut.inventory.dal.Item
import hu.bme.aut.inventory.dal.ItemRepository
import hu.bme.aut.inventory.dal.Review
import hu.bme.aut.inventory.dal.ReviewRepository
import hu.bme.aut.inventory.service.item.exception.RatingOutOfRangeException
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.LocalDate

@Service
class ItemService(
    private val itemRepository: ItemRepository,
    private val reviewRepository: ReviewRepository
) {
    suspend fun getItem(itemId: Long): Mono<Item?> =
        itemRepository.findById(itemId)

    suspend fun getItems(pageable: Pageable = Pageable.unpaged()): Flux<Item> =
        itemRepository.findAllByIdNotNull(pageable)

    suspend fun getItems(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): Flux<Item> =
        itemRepository.findAllByIdIn(ids = ids, pageable = pageable)

    suspend fun saveItem(item: Item): Mono<Item> =
        itemRepository.save(item)

    suspend fun updateItem(item:Item, patchData: Item): Mono<Item> {
        item.apply {
            description = patchData.description

            if (patchData.stock != item.stock) {
                item.stock = patchData.stock
            }

            if (patchData.lowLevel != item.lowLevel) {
                item.lowLevel = patchData.lowLevel
            }
        }

        return itemRepository.save(item)
    }

    suspend fun saveNewReview(
        item: Item,
        reviewerName: String,
        reviewerId: String,
        summary: String,
        rating: Int
    ): Mono<Review> {

        if (rating > 5) {
            throw RatingOutOfRangeException(rating)
        }

        val newReview = Review(
            id = null,
            itemId = item.id!!,
            reviewerName = reviewerName,
            reviewerId = reviewerId,
            summary = summary,
            rating = rating,
            created = LocalDate.now()
        )

        return reviewRepository.save(newReview)
    }
}