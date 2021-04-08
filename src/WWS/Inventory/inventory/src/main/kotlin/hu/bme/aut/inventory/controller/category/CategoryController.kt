package hu.bme.aut.inventory.controller.category

import hu.bme.aut.inventory.controller.category.request.NewCategoryRequest
import hu.bme.aut.inventory.controller.category.response.CategoryResponse
import hu.bme.aut.inventory.service.category.CategoryService
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitSingle
import org.springframework.data.domain.PageRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

@RestController
@RequestMapping("/categories")
class CategoryController(
    private val categoryService: CategoryService
) {
    @PostMapping
    suspend fun createCategory(
        @RequestBody @Valid
        request: NewCategoryRequest
    ): ResponseEntity<CategoryResponse> {
        val savedCategory = categoryService.saveCategory(request.toNew()).awaitSingle()
        return ResponseEntity.ok(CategoryResponse.of(savedCategory))
    }

    @GetMapping("{id}")
    suspend fun getCategory(
        @PathVariable
        id: Long
    ): ResponseEntity<CategoryResponse> {
        val category = categoryService.getCategory(id).awaitFirst()
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(CategoryResponse.of(category))
    }

    @GetMapping
    suspend fun getCategories(
        @RequestParam(required = false)
        offset: Int?,
        @RequestParam(required = false)
        size: Int?
    ): ResponseEntity<List<CategoryResponse>> {
        val pageable = PageRequest.of(offset ?: 0, size ?: 20)
        return ResponseEntity.ok(
            categoryService.getCategories(pageable)
                .asFlow()
                .toList()
                .map { CategoryResponse.of(it) }
        )
    }
}