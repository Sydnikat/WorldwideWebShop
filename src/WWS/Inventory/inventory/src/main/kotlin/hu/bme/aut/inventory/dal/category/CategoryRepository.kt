package hu.bme.aut.inventory.dal.category

import hu.bme.aut.inventory.dal.technicalSpecification.TechnicalSpecEnumListItemCRUDRepository
import hu.bme.aut.inventory.dal.technicalSpecification.TechnicalSpecificationCRUDRepository
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactive.awaitSingleOrNull
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service

@Service
class CategoryRepository(
    private val categoryCRUDRepository: CategoryCRUDRepository,
    private val technicalSpecificationCRUDRepository: TechnicalSpecificationCRUDRepository,
    private val technicalSpecEnumListItemCRUDRepository: TechnicalSpecEnumListItemCRUDRepository
) {
    suspend fun findById(
        categoryId: Long,
        witchTechSpecs: Boolean = true
    ): hu.bme.aut.inventory.domain.Category? {
        val dalCategory = categoryCRUDRepository
            .findById(categoryId).awaitFirstOrNull() ?: return null

        return if (witchTechSpecs) toDomainWitchTechSpecs(listOf(dalCategory))[0] else dalCategory.toDomain()
    }

    suspend fun findAllByNameContaining(
        str: String,
        pageable: Pageable = Pageable.unpaged(),
        witchTechSpecs: Boolean = false
    ): List<hu.bme.aut.inventory.domain.Category> {
        val dalCategories = categoryCRUDRepository
            .findAllByNameContaining(str, pageable)
            .asFlow()
            .toList()

        return if (witchTechSpecs) toDomainWitchTechSpecs(dalCategories) else dalCategories.map { it.toDomain() }
    }

    suspend fun findAllByIdIn(
        ids: List<Long>,
        pageable: Pageable = Pageable.unpaged(),
        witchTechSpecs: Boolean = false
    ): List<hu.bme.aut.inventory.domain.Category> {
        val dalCategories = categoryCRUDRepository
            .findAllByIdIn(ids, pageable)
            .asFlow()
            .toList()

        return if (witchTechSpecs) toDomainWitchTechSpecs(dalCategories) else dalCategories.map { it.toDomain() }
    }

    suspend fun findAllByIdNotNull(
        pageable: Pageable = Pageable.unpaged(),
        witchTechSpecs: Boolean = false
    ): List<hu.bme.aut.inventory.domain.Category> {
        val dalCategories = categoryCRUDRepository
            .findAllByIdNotNull(pageable)
            .asFlow()
            .toList()

        return if (witchTechSpecs) toDomainWitchTechSpecs(dalCategories) else dalCategories.map { it.toDomain() }
    }

    suspend fun save(category: hu.bme.aut.inventory.domain.Category): hu.bme.aut.inventory.domain.Category {
        return categoryCRUDRepository
            .save(Category.toDal(category))
            .awaitSingle()
            .toDomain(category.technicalSpecifications)
    }

    suspend fun delete(category: hu.bme.aut.inventory.domain.Category) {
        categoryCRUDRepository.delete(Category.toDal(category)).awaitSingleOrNull()
    }

    private suspend fun toDomainWitchTechSpecs(
        categories: List<Category>
    ): List<hu.bme.aut.inventory.domain.Category> {
        val techSpecs = technicalSpecificationCRUDRepository.findAllByCategoryIdIn(categories.map { it.id!! })
            .asFlow()
            .toList()
            .map { it.toDomain() }

        val techSpecsWithoutEnumLists = techSpecs.filter { !it.isEnumList }

        val techSpecsWithEnumLists = techSpecs.filter { it.isEnumList }
        val techSpecsEnumListItems = technicalSpecEnumListItemCRUDRepository
            .findAllByTechnicalSpecificationIdIn(techSpecsWithEnumLists.map { it.id!! })
            .asFlow()
            .toList()
            .map { it.toDomain() }

        techSpecsEnumListItems.forEach { item ->
            val enumList = techSpecsWithEnumLists.find { it.id == item.technicalSpecificationId }!!
            enumList.enumList.add(item)
        }

        return categories.map {
            val possibleTechSpecs =
                techSpecsWithEnumLists.filter { ts -> ts.categoryId == it.id } +
                        techSpecsWithoutEnumLists.filter { ts -> ts.categoryId == it.id }
            it.toDomain(possibleTechSpecs)
        }
    }
}