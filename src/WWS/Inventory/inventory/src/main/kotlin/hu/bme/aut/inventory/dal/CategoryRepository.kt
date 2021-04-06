package hu.bme.aut.inventory.dal

import org.springframework.data.domain.Pageable
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface CategoryRepository : ReactiveCrudRepository<Category, Long> {
    fun findAllByNameContaining(str: String, pageable: Pageable = Pageable.unpaged()): Flux<Category>
    fun findAllByIdIn(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): Flux<Category>
}