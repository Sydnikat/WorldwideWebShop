package hu.bme.aut.inventory.dal

import org.springframework.data.domain.Pageable
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import java.time.LocalDate

@Repository
interface DiscountRepository : ReactiveCrudRepository<Discount, Long> {
    fun findAllByIdIn(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): Flux<Discount>
    fun findAllByIdNotNull(pageable: Pageable = Pageable.unpaged()): Flux<Discount>
    fun findAllByExpiredAndEndDateLessThanEqual(expired: Boolean, date: LocalDate): Flux<Discount>
    fun findAllByExpiredAndCategoryIdOrderByEndDateDesc(expired: Boolean, categoryId: Long): Flux<Discount>
}