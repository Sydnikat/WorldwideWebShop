package hu.bme.aut.inventory.dal.item

import hu.bme.aut.inventory.dal.review.ReviewRepository
import hu.bme.aut.inventory.dal.technicalSpecification.TechnicalSpecInfoCRUDRepository
import hu.bme.aut.inventory.domain.review.Review
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import org.springframework.stereotype.Service

@Service
abstract class ItemRepositoryBase(
    protected val reviewRepository: ReviewRepository,
    protected val technicalSpecInfoCRUDRepository: TechnicalSpecInfoCRUDRepository
) {
    protected suspend fun findReviewsForItems(itemIds: List<Long>): List<Review> =
        reviewRepository.findAllByItemIdIn(itemIds)

    protected suspend fun toDomain(dalItems: List<Item>, reviews: List<Review>): List<hu.bme.aut.inventory.domain.item.Item> {
        val listOfSpecInfo = technicalSpecInfoCRUDRepository
            .findAllByItemIdIn(dalItems.map { it.id!! })
            .asFlow()
            .toList()
            .map { it.toDomain() }

        return dalItems.map {
            val reviewsOfItem = reviews.filter { r -> r.itemId == it.id }
            val listOfSpecInfoOfItem = listOfSpecInfo.filter { si -> si.itemId == it.id }
            it.toDomain(reviewsOfItem, listOfSpecInfoOfItem)
        }
    }
}