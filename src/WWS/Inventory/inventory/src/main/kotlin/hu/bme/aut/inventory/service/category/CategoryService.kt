package hu.bme.aut.inventory.service.category

import hu.bme.aut.inventory.dal.Category
import hu.bme.aut.inventory.dal.CategoryRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class CategoryService(
    private val categoryRepository: CategoryRepository
) {
    suspend fun getCategory(categoryId: Long): Mono<Category?> =
        categoryRepository.findById(categoryId)

    suspend fun getCategories(pageable: Pageable = Pageable.unpaged()): Flux<Category> =
        categoryRepository.findAllByIdNotNull(pageable)

    suspend fun getCategories(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): Flux<Category> =
        categoryRepository.findAllByIdIn(ids = ids, pageable)

    suspend fun getCategoriesWithName(name: String, pageable: Pageable = Pageable.unpaged()): Flux<Category> =
        categoryRepository.findAllByNameContaining(str = name, pageable)

    suspend fun saveCategory(category: Category): Mono<Category> =
        categoryRepository.save(category)
}