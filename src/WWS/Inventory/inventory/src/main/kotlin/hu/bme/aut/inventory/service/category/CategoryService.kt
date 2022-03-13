package hu.bme.aut.inventory.service.category

import hu.bme.aut.inventory.domain.category.Category
import hu.bme.aut.inventory.dal.category.CategoryRepository
import hu.bme.aut.inventory.dal.discount.DiscountRepository
import hu.bme.aut.inventory.domain.item.Item
import hu.bme.aut.inventory.dal.item.ItemRepository
import hu.bme.aut.inventory.dal.technicalSpecification.TechnicalSpecificationRepository
import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecification
import hu.bme.aut.inventory.service.common.TechSpecInfoValidator
import hu.bme.aut.inventory.service.common.exception.MultipleTechnicalSpecificationReference
import hu.bme.aut.inventory.service.common.exception.TechnicalSpecificationInfoValueIsInvalid
import hu.bme.aut.inventory.service.common.exception.TechnicalSpecificationNotFoundForInfo

import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDate
import kotlin.jvm.Throws

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val itemRepository: ItemRepository,
    private val discountRepository: DiscountRepository,
    private val technicalSpecificationRepository: TechnicalSpecificationRepository
) {
    suspend fun getCategory(categoryId: Long): Category? =
        categoryRepository.findById(categoryId)

    suspend fun getCategories(pageable: Pageable = Pageable.unpaged()): List<Category> =
        categoryRepository.findAllByIdNotNull(pageable)

    suspend fun getCategories(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): List<Category> =
        categoryRepository.findAllByIdIn(ids = ids, pageable = pageable)

    suspend fun saveCategory(category: Category): Category =
        categoryRepository.save(category)

    suspend fun saveTechnicalSpecification(techSpec: TechnicalSpecification): TechnicalSpecification =
        technicalSpecificationRepository.save(techSpec)

    suspend fun deleteTechnicalSpecifications(techSpecs: List<TechnicalSpecification>) {
        technicalSpecificationRepository.deleteAll(techSpecs)
    }

    suspend fun saveNewItem(category: Category, newItem: Item): Item {
        val possibleDiscount = discountRepository
            .findAllByExpiredAndCategoryIdOrderByEndDateDesc(expired = false, categoryId = category.id!!)
            .firstOrNull()

        if (possibleDiscount != null) {
            newItem.discountId = possibleDiscount.id
            newItem.discount = possibleDiscount.value.toLong()
        }

        return itemRepository.save(newItem)
    }

    suspend fun deleteCategory(category: Category) {
        val items = itemRepository.findAllByCategoryId(categoryId = category.id!!)
        val categoryLevelDiscounts = discountRepository.findAllByCategoryId(category.id)

        discountRepository.deleteAll(categoryLevelDiscounts)
        itemRepository.deleteAll(items)
        technicalSpecificationRepository.deleteAll(category.technicalSpecifications)

        categoryRepository.delete(category)
    }
}