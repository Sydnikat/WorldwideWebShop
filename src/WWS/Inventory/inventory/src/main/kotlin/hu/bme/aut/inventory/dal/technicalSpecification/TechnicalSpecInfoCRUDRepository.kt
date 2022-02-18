package hu.bme.aut.inventory.dal.technicalSpecification

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface TechnicalSpecInfoCRUDRepository : ReactiveCrudRepository<TechnicalSpecInfo, Long> {
    fun findAllByItemId(itemId: Long): Flux<TechnicalSpecInfo>
    fun findAllByItemIdIn(itemIds: List<Long>): Flux<TechnicalSpecInfo>
    fun findAllByTechnicalSpecificationId(technicalSpecificationId: Long): Flux<TechnicalSpecInfo>
    fun findAllByTechnicalSpecificationIdIn(technicalSpecificationIds: List<Long>): Flux<TechnicalSpecInfo>
}