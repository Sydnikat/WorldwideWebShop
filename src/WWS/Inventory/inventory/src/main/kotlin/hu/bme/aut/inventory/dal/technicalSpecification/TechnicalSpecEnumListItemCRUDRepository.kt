package hu.bme.aut.inventory.dal.technicalSpecification

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import reactor.core.publisher.Flux

@Repository
interface TechnicalSpecEnumListItemCRUDRepository : ReactiveCrudRepository<TechnicalSpecEnumListItem, Long> {
    fun findAllByTechnicalSpecificationId(technicalSpecificationId: Long): Flux<TechnicalSpecEnumListItem>
    fun findAllByTechnicalSpecificationIdIn(technicalSpecificationIds: List<Long>): Flux<TechnicalSpecEnumListItem>
}