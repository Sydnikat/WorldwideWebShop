package hu.bme.aut.inventory.dal.technicalSpecification

import hu.bme.aut.inventory.domain.technicalSpecification.EnumListTechnicalSpecification
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactive.awaitSingleOrNull
import org.springframework.stereotype.Service

@Service
class TechnicalSpecificationRepository(
    private val technicalSpecificationCRUDRepository: TechnicalSpecificationCRUDRepository,
    private val technicalSpecEnumListItemCRUDRepository: TechnicalSpecEnumListItemCRUDRepository
) {
    suspend fun save(
        techSpec: hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecification
    ): hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecification {
        val savedTechSpec = technicalSpecificationCRUDRepository
            .save(TechnicalSpecification.toDal(techSpec))
            .awaitSingle()
            .toDomain()

        return if (techSpec is EnumListTechnicalSpecification && techSpec.enumList.isNotEmpty()) {
            val existingEnumItems = technicalSpecEnumListItemCRUDRepository
                .findAllByTechnicalSpecificationId(savedTechSpec.id!!)
                .asFlow()
                .toList()

            if (existingEnumItems.isNotEmpty()) {
                existingEnumItems
                    .filter { item -> !techSpec.enumList.map { it.id }.contains(item.id) }
                    .also { technicalSpecEnumListItemCRUDRepository.deleteAll(it).awaitSingleOrNull() }
            }

            val enumList = technicalSpecEnumListItemCRUDRepository
                .saveAll(techSpec.enumList.map { TechnicalSpecEnumListItem.toDal(it) })
                .asFlow()
                .toList()
                .map { it.toDomain() }
            (savedTechSpec as EnumListTechnicalSpecification).apply { this.enumList.addAll(enumList) }
        } else savedTechSpec
    }

    suspend fun delete(techSpec: hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecification) {
        technicalSpecEnumListItemCRUDRepository.deleteAllByTechnicalSpecificationId(techSpec.id!!).awaitSingleOrNull()
        technicalSpecificationCRUDRepository.delete(TechnicalSpecification.toDal(techSpec)).awaitSingleOrNull()
    }

    suspend fun deleteAll(techSpecs: List<hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecification>) {
        technicalSpecEnumListItemCRUDRepository.deleteAllByTechnicalSpecificationIdIn(techSpecs.map { it.id!! }).awaitSingleOrNull()
        technicalSpecificationCRUDRepository.deleteAll(techSpecs.map { TechnicalSpecification.toDal(it) }).awaitSingleOrNull()
    }

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