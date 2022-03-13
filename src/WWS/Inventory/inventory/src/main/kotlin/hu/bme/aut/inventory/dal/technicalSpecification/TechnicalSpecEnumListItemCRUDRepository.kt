package hu.bme.aut.inventory.dal.technicalSpecification

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Repository
interface TechnicalSpecEnumListItemCRUDRepository : ReactiveCrudRepository<TechnicalSpecEnumListItem, Long> {
    fun findAllByTechnicalSpecificationId(technicalSpecificationId: Long): Flux<TechnicalSpecEnumListItem>
    fun findAllByTechnicalSpecificationIdIn(technicalSpecificationIds: List<Long>): Flux<TechnicalSpecEnumListItem>
    fun deleteAllByTechnicalSpecificationId(technicalSpecificationId: Long): Mono<Void>
    fun deleteAllByTechnicalSpecificationIdIn(technicalSpecificationIds: List<Long>): Mono<Void>
}