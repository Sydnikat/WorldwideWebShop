package hu.bme.aut.inventory.dal.technicalSpecification

import hu.bme.aut.inventory.domain.technicalSpecification.EnumListTechnicalSpecification
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import org.springframework.stereotype.Service

@Service
class TechnicalSpecificationRepository(
    private val technicalSpecificationCRUDRepository: TechnicalSpecificationCRUDRepository,
    private val technicalSpecEnumListItemCRUDRepository: TechnicalSpecEnumListItemCRUDRepository
) {
    suspend fun findAllByCategoryIdIn(
        categoryIds: List<Long>
    ): List<hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecification> {
        val techSpecs = technicalSpecificationCRUDRepository.findAllByCategoryIdIn(categoryIds)
            .asFlow()
            .toList()
            .map { it.toDomain() }

        return findAllEnumListItems(techSpecs)
    }

    suspend fun findAllByIdIn(
        specIds: List<Long>
    ): List<hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecification> {
        val techSpecs = technicalSpecificationCRUDRepository.findAllByIdIn(specIds)
            .asFlow()
            .toList()
            .map { it.toDomain() }

        return findAllEnumListItems(techSpecs)
    }

    private suspend fun findAllEnumListItems(
        techSpecs: List<hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecification>
    ): List<hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecification> {

        val techSpecsWithoutEnumLists = techSpecs.filter { it !is EnumListTechnicalSpecification }

        val techSpecsWithEnumLists = techSpecs.filterIsInstance<EnumListTechnicalSpecification>()
        val enumItems = technicalSpecEnumListItemCRUDRepository
            .findAllByTechnicalSpecificationIdIn(techSpecs.map { it.id!! })
            .asFlow()
            .toList()
            .map { it.toDomain() }

        enumItems.forEach { item ->
            val enumList = techSpecsWithEnumLists.find { it.id == item.technicalSpecificationId }!!
            enumList.enumList.add(item)
        }

        return techSpecsWithEnumLists + techSpecsWithoutEnumLists
    }

}