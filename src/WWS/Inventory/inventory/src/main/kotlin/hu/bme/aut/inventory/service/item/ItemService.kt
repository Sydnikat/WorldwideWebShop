package hu.bme.aut.inventory.service.item

import hu.bme.aut.inventory.dal.Item
import hu.bme.aut.inventory.dal.ItemRepository
import hu.bme.aut.inventory.dal.QueryRepository
import hu.bme.aut.inventory.dal.Review
import hu.bme.aut.inventory.dal.ReviewRepository
import hu.bme.aut.inventory.service.item.exception.RatingOutOfRangeException
import hu.bme.aut.inventory.util.increaseRating
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactive.awaitSingleOrNull
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.domain.Sort.Order.asc
import org.springframework.data.domain.Sort.Order.desc
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.data.relational.core.query.Criteria
import org.springframework.data.relational.core.query.Query
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.LocalDate
import kotlin.jvm.Throws

@Service
class ItemService(
    private val itemRepository: ItemRepository,
    private val reviewRepository: ReviewRepository,
    private val queryRepository: QueryRepository
) {
    suspend fun getItem(itemId: Long): Mono<Item?> =
        itemRepository.findById(itemId)

    suspend fun searchItems(
        queryStr: String,
        sortBy: SortingType,
        sort: SortingDirection,
        hasStock: Boolean,
        price: List<Long>?,
        categories: List<Long>?,
        pageable: Pageable = Pageable.unpaged()
    ): Flux<Item> {
        val priceInterval = if (price != null && price.size == 2) {
            Pair(price[0], price[1])
        } else null

        var skip: Long? = null
        var limit: Int? = null
        if (pageable.isPaged) {
            skip = pageable.offset
            limit = pageable.pageSize
        }

        return queryRepository.searchItemWithQuery(
            queryStr = queryStr,
            hasStock = hasStock,
            categories = categories ?: listOf(),
            price = priceInterval,
            sortingBy = sortBy,
            sortDirection = sort,
            skip = skip,
            limit = limit
        )
    }

    suspend fun getItems(pageable: Pageable = Pageable.unpaged()): Flux<Item> =
        itemRepository.findAllByIdNotNull(pageable)

    suspend fun getItems(categoryId: Long, pageable: Pageable = Pageable.unpaged()): Flux<Item> =
        itemRepository.findAllByCategoryId(categoryId = categoryId, pageable = pageable)

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

    suspend fun saveItems(items: List<Item>): Flux<Item> {
        return itemRepository.saveAll(items)
    }

    @Throws(
        RatingOutOfRangeException::class,
    )
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
            rating = rating.toFloat(),
            created = LocalDate.now()
        )

        val savedReview = reviewRepository.save(newReview).awaitSingle()

        item.increaseRating(savedReview.rating.toInt())
        itemRepository.save(item).subscribe()

        return Mono.just(savedReview)
    }

    suspend fun deleteItem(item: Item) {
        reviewRepository.deleteAllByItemId(itemId = item.id!!).awaitSingleOrNull()
        itemRepository.delete(item).awaitSingleOrNull()
    }
}