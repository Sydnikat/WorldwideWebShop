package hu.bme.aut.inventory.dal.review

import org.springframework.data.domain.Pageable
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface ReviewCRUDRepository : ReactiveCrudRepository<Review, Long> {
    fun findAllByIdIn(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): Flux<Review>
    fun findAllByIdNotNull(pageable: Pageable = Pageable.unpaged()): Flux<Review>
    fun findAllByItemId(itemId: Long, pageable: Pageable = Pageable.unpaged()): Flux<Review>
    fun findAllByItemIdIn(itemIds: List<Long>, pageable: Pageable = Pageable.unpaged()): Flux<Review>

    @Query(value = """
        SELECT AVG(Rating)
          FROM Review
         WHERE ItemID = ?0
      GROUP BY ItemID
    """)
    fun getAverageRatingOfItem(itemId: Long): Mono<Float>
    fun deleteAllByItemId(itemId: Long): Mono<Void>
}