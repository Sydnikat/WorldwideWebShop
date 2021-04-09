package hu.bme.aut.inventory.dal

import org.springframework.data.domain.Pageable
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface ItemRepository : ReactiveCrudRepository<Item, Long> {
    fun findAllByIdIn(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): Flux<Item>
    fun findAllByCategoryId(categoryId: Long, pageable: Pageable = Pageable.unpaged()): Flux<Item>
    fun findAllByIdNotNull(pageable: Pageable = Pageable.unpaged()): Flux<Item>
    fun findAllByDiscountId(discountId: Long): Flux<Item>
}