package hu.bme.aut.inventory.dal.discount

import org.springframework.data.domain.Pageable
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import java.time.LocalDate

interface DiscountCRUDRepository : ReactiveCrudRepository<Discount, Long> {
    fun findAllByIdIn(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): Flux<Discount>
    fun findAllByIdNotNull(pageable: Pageable = Pageable.unpaged()): Flux<Discount>
    fun findAllByExpiredAndEndDateLessThanEqual(expired: Boolean, date: LocalDate): Flux<Discount>
    fun findAllByExpiredAndCategoryIdOrderByEndDateDesc(expired: Boolean, categoryId: Long): Flux<Discount>
    fun findAllByCategoryId(categoryId: Long): Flux<Discount>
}