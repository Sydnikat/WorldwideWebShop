package hu.bme.aut.inventory.dal.technicalSpecification

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface TechnicalSpecificationCRUDRepository : ReactiveCrudRepository<TechnicalSpecification, Long> {
    fun findAllByCategoryId(categoryId: Long): Flux<TechnicalSpecification>
    fun findAllByCategoryIdIn(categoryIds: List<Long>): Flux<TechnicalSpecification>
    fun findAllByIdIn(techSpecIds: List<Long>): Flux<TechnicalSpecification>
}