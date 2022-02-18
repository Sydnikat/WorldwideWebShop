package hu.bme.aut.inventory.service.item

import hu.bme.aut.inventory.domain.Item
import hu.bme.aut.inventory.dal.item.ItemRepository
import hu.bme.aut.inventory.dal.item.QueryRepository
import hu.bme.aut.inventory.domain.Review
import hu.bme.aut.inventory.dal.review.ReviewRepository
import hu.bme.aut.inventory.service.item.exception.RatingOutOfRangeException
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDate
import kotlin.jvm.Throws

@Service
class ItemService(
    private val itemRepository: ItemRepository,
    private val reviewRepository: ReviewRepository,
    private val queryRepository: QueryRepository
) {
    suspend fun getItem(itemId: Long): Item? =
        itemRepository.findById(itemId)

    suspend fun searchItems(
        queryStr: String,
        sortBy: SortingType,
        sort: SortingDirection,
        hasStock: Boolean,
        price: List<Long>?,
        categories: List<Long>?,
        pageable: Pageable = Pageable.unpaged()
    ): List<Item> {
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

    suspend fun getItems(pageable: Pageable = Pageable.unpaged()): List<Item> =
        itemRepository.findAllByIdNotNull(pageable)

    suspend fun getItems(categoryId: Long, pageable: Pageable = Pageable.unpaged()): List<Item> =
        itemRepository.findAllByCategoryId(categoryId = categoryId, pageable = pageable)

    suspend fun getItems(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): List<Item> =
        itemRepository.findAllByIdIn(ids = ids, pageable = pageable)

    suspend fun saveItem(item: Item): Item =
        itemRepository.save(item)

    suspend fun updateItem(item:Item, patchData: Item): Item {
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

    suspend fun saveItems(items: List<Item>): List<Item> {
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
    ): Review {

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

        val savedReview = reviewRepository.save(newReview)

        item.increaseRating(savedReview.rating.toInt())
        itemRepository.save(item)

        return savedReview
    }

    suspend fun deleteItem(item: Item) {
        reviewRepository.deleteAllByItemId(itemId = item.id!!)
        itemRepository.delete(item)
    }
}