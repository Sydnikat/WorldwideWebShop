package hu.bme.aut.inventory.service.category

import hu.bme.aut.inventory.domain.category.Category
import hu.bme.aut.inventory.dal.category.CategoryRepository
import hu.bme.aut.inventory.dal.discount.DiscountRepository
import hu.bme.aut.inventory.domain.item.Item
import hu.bme.aut.inventory.dal.item.ItemRepository
import hu.bme.aut.inventory.dal.review.ReviewRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val itemRepository: ItemRepository,
    private val reviewRepository: ReviewRepository,
    private val discountRepository: DiscountRepository
) {
    suspend fun getCategory(categoryId: Long): Category? =
        categoryRepository.findById(categoryId)

    suspend fun getCategories(pageable: Pageable = Pageable.unpaged()): List<Category> =
        categoryRepository.findAllByIdNotNull(pageable)

    suspend fun getCategories(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): List<Category> =
        categoryRepository.findAllByIdIn(ids = ids, pageable = pageable)

    suspend fun getCategoriesWithName(name: String, pageable: Pageable = Pageable.unpaged()): List<Category> =
        categoryRepository.findAllByNameContaining(str = name, pageable = pageable)

    suspend fun saveCategory(category: Category): Category =
        categoryRepository.save(category)

    suspend fun saveNewItem(category: Category, name: String, description: String, price: Float): Item {
        val newItem = Item(
            id = null,
            categoryId = category.id!!,
            name = name,
            description = description,
            discountId = null,
            discount = null,
            rating = null,
            ratingCount = 0,
            created = LocalDate.now(),
            price = price,
            stock = 0,
            lowLevel = 0,
            reviews = listOf(),
            listOfTechnicalSpecInfo = listOf()
        )

        val possibleDiscount = discountRepository
            .findAllByExpiredAndCategoryIdOrderByEndDateDesc(expired = false, categoryId = category.id)
            .firstOrNull()

        if (possibleDiscount != null) {
            newItem.discountId = possibleDiscount.id
            newItem.discount = possibleDiscount.value.toLong()
        }

        return itemRepository.save(newItem)
    }

    suspend fun deleteCategory(category: Category) {
        val items = itemRepository.findAllByCategoryId(categoryId = category.id!!)
        val reviews = reviewRepository.findAllByItemIdIn(itemIds = items.map { it.id!! })
        val categoryLevelDiscounts = discountRepository.findAllByCategoryId(category.id)

        discountRepository.deleteAll(categoryLevelDiscounts)
        itemRepository.deleteAll(items)
        reviewRepository.deleteAll(reviews)

        categoryRepository.delete(category)
    }
}