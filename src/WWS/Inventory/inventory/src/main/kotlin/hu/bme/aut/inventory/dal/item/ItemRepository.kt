package hu.bme.aut.inventory.dal.item

import hu.bme.aut.inventory.dal.review.ReviewRepository
import hu.bme.aut.inventory.dal.technicalSpecification.TechnicalSpecInfo
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
    suspend fun save(item: hu.bme.aut.inventory.domain.item.Item): hu.bme.aut.inventory.domain.item.Item {
        val savedItem =  itemCRUDRepository
            .save(Item.toDal(item))
            .awaitSingle()

        return if (item.listOfTechnicalSpecInfo.isNotEmpty()) {
            val existingListOfSpecInfo = technicalSpecInfoCRUDRepository
                .findAllByItemId(savedItem.id!!)
                .asFlow()
                .toList()

            if (existingListOfSpecInfo.isNotEmpty()) {
                existingListOfSpecInfo
                    .filter { info -> !item.listOfTechnicalSpecInfo.map { it.id }.contains(info.id) }
                    .also { technicalSpecInfoCRUDRepository.deleteAll(it).awaitSingleOrNull() }
            }

            val savedListOfSpecInfo = technicalSpecInfoCRUDRepository
                .saveAll(item.listOfTechnicalSpecInfo.map { TechnicalSpecInfo.toDal(it) })
                .asFlow()
                .toList()
                .map { it.toDomain() }

            savedItem.toDomain(item.reviews, savedListOfSpecInfo)
        } else savedItem.toDomain(item.reviews)
    }

    suspend fun saveAll(items: List<hu.bme.aut.inventory.domain.item.Item>): List<hu.bme.aut.inventory.domain.item.Item> {
        val reviews = items.flatMap { it.reviews }
        val dalItems = itemCRUDRepository
            .saveAll(items.map { Item.toDal(it) })
            .asFlow()
            .toList()

        return toDomain(dalItems, reviews)
    }

    suspend fun findById(itemId: Long, witchReviews: Boolean = true): hu.bme.aut.inventory.domain.item.Item? {
        val dalItem = itemCRUDRepository.findById(itemId).awaitFirstOrNull() ?: return null
        val reviews = if (witchReviews) findReviewsForItems(listOf(dalItem.id!!)) else listOf()
        return toDomain(listOf(dalItem), reviews)[0]
    }

    suspend fun findAllByIdIn(
        ids: List<Long>,
        pageable: Pageable = Pageable.unpaged(),
        witchReviews: Boolean = false
    ): List<hu.bme.aut.inventory.domain.item.Item> {
        val dalItems = itemCRUDRepository.findAllByIdIn(ids, pageable).asFlow().toList()
        val reviews = if (witchReviews) findReviewsForItems(dalItems.map { it.id!! }) else listOf()

        return toDomain(dalItems, reviews)
    }

    suspend fun findAllByCategoryId(
        categoryId: Long,
        pageable: Pageable = Pageable.unpaged(),
        witchReviews: Boolean = false
    ): List<hu.bme.aut.inventory.domain.item.Item> {
        val dalItems = itemCRUDRepository.findAllByCategoryId(categoryId, pageable).asFlow().toList()
        val reviews = if (witchReviews) findReviewsForItems(dalItems.map { it.id!! }) else listOf()

        return toDomain(dalItems, reviews)
    }

    suspend fun findAllByNameAndCategory(
        name: String,
        categoryId: Long?,
        pageable: Pageable = Pageable.unpaged(),
    ): List<hu.bme.aut.inventory.domain.item.Item> {
        val categories = if (categoryId != null) listOf(categoryId) else listOf()
        val dalItems = itemCRUDRepository.findAllByNameIsStartingWithAndCategoryIdIn(name, categories).asFlow().toList()
        return toDomain(dalItems, listOf())
    }

    suspend fun findAllByIdNotNull(
        pageable: Pageable = Pageable.unpaged(),
        witchReviews: Boolean = false
    ): List<hu.bme.aut.inventory.domain.item.Item> {
        val dalItems = itemCRUDRepository.findAllByIdNotNull(pageable).asFlow().toList()
        val reviews = if (witchReviews) findReviewsForItems(dalItems.map { it.id!! }) else listOf()

        return toDomain(dalItems, reviews)
    }

    suspend fun findAllByDiscountId(
        discountId: Long,
        witchReviews: Boolean = false
    ): List<hu.bme.aut.inventory.domain.item.Item> {
        val dalItems = itemCRUDRepository.findAllByDiscountId(discountId).asFlow().toList()
        val reviews = if (witchReviews) findReviewsForItems(dalItems.map { it.id!! }) else listOf()

        return toDomain(dalItems, reviews)
    }

    suspend fun delete(item: hu.bme.aut.inventory.domain.item.Item) {
        technicalSpecInfoCRUDRepository
            .deleteAll(item.listOfTechnicalSpecInfo.map { TechnicalSpecInfo.toDal(it) })
            .awaitSingleOrNull()

        reviewRepository.deleteAll(item.reviews)

        itemCRUDRepository
            .delete(Item.toDal(item))
            .awaitSingleOrNull()
    }

    suspend fun deleteAll(items: List<hu.bme.aut.inventory.domain.item.Item>) {
        technicalSpecInfoCRUDRepository.deleteAll(
            items.flatMap { item -> item.listOfTechnicalSpecInfo.map { TechnicalSpecInfo.toDal(it) } }
        ).awaitSingleOrNull()

        reviewRepository.deleteAll(items.flatMap { it.reviews })

        itemCRUDRepository
            .deleteAll(items.map { Item.toDal(it) })
            .awaitSingleOrNull()
    }
}