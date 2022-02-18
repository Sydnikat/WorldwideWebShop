package hu.bme.aut.inventory.dal.item

import hu.bme.aut.inventory.dal.review.ReviewRepository
import hu.bme.aut.inventory.dal.technicalSpecification.TechnicalSpecInfoCRUDRepository
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactive.awaitSingleOrNull
import org.springframework.data.domain.Pageable
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.stereotype.Service

@Service
class ItemRepository(
    private val template: R2dbcEntityTemplate,
    private val itemCRUDRepository: ItemCRUDRepository,
    reviewRepository: ReviewRepository,
    technicalSpecInfoCRUDRepository: TechnicalSpecInfoCRUDRepository
) : ItemRepositoryBase(reviewRepository, technicalSpecInfoCRUDRepository) {
    suspend fun save(item: hu.bme.aut.inventory.domain.Item): hu.bme.aut.inventory.domain.Item {
        return itemCRUDRepository
            .save(Item.toDal(item))
            .awaitSingle()
            .toDomain(item.reviews)
    }

    suspend fun saveAll(items: List<hu.bme.aut.inventory.domain.Item>): List<hu.bme.aut.inventory.domain.Item> {
        val reviews = items.flatMap { it.reviews }
        val dalItems = itemCRUDRepository
            .saveAll(items.map { Item.toDal(it) })
            .asFlow()
            .toList()

        return toDomain(dalItems, reviews)
    }

    suspend fun findById(itemId: Long, witchReviews: Boolean = true): hu.bme.aut.inventory.domain.Item? {
        val dalItem = itemCRUDRepository.findById(itemId).awaitFirstOrNull() ?: return null
        val reviews = if (witchReviews) findReviewsForItems(listOf(dalItem.id!!)) else listOf()
        return toDomain(listOf(dalItem), reviews)[0]
    }

    suspend fun findAllByIdIn(
        ids: List<Long>,
        pageable: Pageable = Pageable.unpaged(),
        witchReviews: Boolean = false
    ): List<hu.bme.aut.inventory.domain.Item> {
        val dalItems = itemCRUDRepository.findAllByIdIn(ids, pageable).asFlow().toList()
        val reviews = if (witchReviews) findReviewsForItems(dalItems.map { it.id!! }) else listOf()

        return toDomain(dalItems, reviews)
    }

    suspend fun findAllByCategoryId(
        categoryId: Long,
        pageable: Pageable = Pageable.unpaged(),
        witchReviews: Boolean = false
    ): List<hu.bme.aut.inventory.domain.Item> {
        val dalItems = itemCRUDRepository.findAllByCategoryId(categoryId, pageable).asFlow().toList()
        val reviews = if (witchReviews) findReviewsForItems(dalItems.map { it.id!! }) else listOf()

        return toDomain(dalItems, reviews)
    }

    suspend fun findAllByIdNotNull(
        pageable: Pageable = Pageable.unpaged(),
        witchReviews: Boolean = false
    ): List<hu.bme.aut.inventory.domain.Item> {
        val dalItems = itemCRUDRepository.findAllByIdNotNull(pageable).asFlow().toList()
        val reviews = if (witchReviews) findReviewsForItems(dalItems.map { it.id!! }) else listOf()

        return toDomain(dalItems, reviews)
    }

    suspend fun findAllByDiscountId(
        discountId: Long,
        witchReviews: Boolean = false
    ): List<hu.bme.aut.inventory.domain.Item> {
        val dalItems = itemCRUDRepository.findAllByDiscountId(discountId).asFlow().toList()
        val reviews = if (witchReviews) findReviewsForItems(dalItems.map { it.id!! }) else listOf()

        return toDomain(dalItems, reviews)
    }

    suspend fun delete(item: hu.bme.aut.inventory.domain.Item) {
        itemCRUDRepository.delete(Item.toDal(item)).awaitSingleOrNull()
    }

    suspend fun deleteAll(items: List<hu.bme.aut.inventory.domain.Item>) {
        itemCRUDRepository.deleteAll(items.map { Item.toDal(it) }).awaitSingleOrNull()
    }
}