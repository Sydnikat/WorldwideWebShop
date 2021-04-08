package hu.bme.aut.inventory.dal

import org.springframework.data.domain.Pageable
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ReviewRepository : ReactiveCrudRepository<Review, Long> {
    fun findAllByIdIn(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): Flux<Review>
    fun findAllByIdNotNull(pageable: Pageable = Pageable.unpaged()): Flux<Review>
    fun findAllByItemId(itemId: Long, pageable: Pageable = Pageable.unpaged()): Flux<Review>
}