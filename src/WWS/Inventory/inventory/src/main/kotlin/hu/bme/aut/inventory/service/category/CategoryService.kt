package hu.bme.aut.inventory.service.category

import hu.bme.aut.inventory.dal.Category
import hu.bme.aut.inventory.dal.CategoryRepository
import hu.bme.aut.inventory.dal.Item
import hu.bme.aut.inventory.dal.ItemRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.LocalDate

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository,
    private val itemRepository: ItemRepository
) {
    suspend fun getCategory(categoryId: Long): Mono<Category?> =
        categoryRepository.findById(categoryId)

    suspend fun getCategories(pageable: Pageable = Pageable.unpaged()): Flux<Category> =
        categoryRepository.findAllByIdNotNull(pageable)

    suspend fun getCategories(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): Flux<Category> =
        categoryRepository.findAllByIdIn(ids = ids, pageable = pageable)

    suspend fun getCategoriesWithName(name: String, pageable: Pageable = Pageable.unpaged()): Flux<Category> =
        categoryRepository.findAllByNameContaining(str = name, pageable = pageable)

    suspend fun saveCategory(category: Category): Mono<Category> =
        categoryRepository.save(category)

    suspend fun saveNewItem(category: Category, name: String, description: String): Mono<Item> {
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
            stock = 0,
            lowLevel = 0
        )
        return itemRepository.save(newItem)
    }
}