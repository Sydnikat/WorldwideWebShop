package hu.bme.aut.inventory.dal.review

import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactive.awaitSingleOrNull
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class ReviewRepository(
    private val reviewCRUDRepository: ReviewCRUDRepository
) {
    suspend fun findById(reviewId: Long): hu.bme.aut.inventory.domain.review.Review? {
        return reviewCRUDRepository.findById(reviewId).awaitFirstOrNull()?.toDomain()
    }

    suspend fun save(review: hu.bme.aut.inventory.domain.review.Review): hu.bme.aut.inventory.domain.review.Review {
        return reviewCRUDRepository.save(Review.toDal(review)).awaitSingle().toDomain()
    }

    suspend fun findAllByIdIn(
        ids: List<Long>,
        pageable: Pageable = Pageable.unpaged()
    ): List<hu.bme.aut.inventory.domain.review.Review> {
        return reviewCRUDRepository
            .findAllByIdIn(ids, pageable)
            .asFlow()
            .toList()
            .map { it.toDomain() }
    }

    suspend fun findAllByIdNotNull(
        pageable: Pageable = Pageable.unpaged()
    ): List<hu.bme.aut.inventory.domain.review.Review> {
        return reviewCRUDRepository
            .findAllByIdNotNull(pageable)
            .asFlow()
            .toList()
            .map { it.toDomain() }
    }

    suspend fun findAllByItemId(
        itemId: Long,
        pageable: Pageable = Pageable.unpaged()
    ): List<hu.bme.aut.inventory.domain.review.Review> {
        return reviewCRUDRepository
            .findAllByItemId(itemId, pageable)
            .asFlow()
            .toList()
            .map { it.toDomain() }
    }

    suspend fun findAllByItemIdIn(
        itemIds: List<Long>,
        pageable: Pageable = Pageable.unpaged()
    ): List<hu.bme.aut.inventory.domain.review.Review> {
        return reviewCRUDRepository
            .findAllByItemIdIn(itemIds, pageable)
            .asFlow()
            .toList()
            .map { it.toDomain() }
    }

    suspend fun getAverageRatingOfItem(itemId: Long): Float {
        return reviewCRUDRepository.getAverageRatingOfItem(itemId).awaitSingle()
    }

    suspend fun deleteAllByItemId(itemId: Long) {
        reviewCRUDRepository.deleteAllByItemId(itemId).awaitSingleOrNull()
    }

    suspend fun delete(review: hu.bme.aut.inventory.domain.review.Review) {
        reviewCRUDRepository.delete(Review.toDal(review)).awaitSingleOrNull()
    }

    suspend fun deleteAll(reviews: List<hu.bme.aut.inventory.domain.review.Review>) {
        reviewCRUDRepository.deleteAll(reviews.map { Review.toDal(it) }).awaitSingleOrNull()
    }
}