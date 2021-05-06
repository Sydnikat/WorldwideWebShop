package hu.bme.aut.inventory.controller.category

import hu.bme.aut.inventory.config.resolver.UserMetaData
import hu.bme.aut.inventory.config.resolver.WWSUserMetaData
import hu.bme.aut.inventory.controller.category.request.NewCategoryRequest
import hu.bme.aut.inventory.controller.category.response.CategoryResponse
import hu.bme.aut.inventory.controller.item.request.NewItemRequest
import hu.bme.aut.inventory.controller.item.response.ItemResponse
import hu.bme.aut.inventory.exception.RequestError
import hu.bme.aut.inventory.service.auth.AuthManager
import hu.bme.aut.inventory.service.category.CategoryService
import hu.bme.aut.inventory.util.requestError
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactive.awaitSingle
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

@RestController
@RequestMapping("/api/inventory/categories")
class CategoryController(
    private val categoryService: CategoryService,
    private val authManager: AuthManager
) {
    @PostMapping
    suspend fun createCategory(
        @WWSUserMetaData
        user: UserMetaData,
        @RequestBody @Valid
        request: NewCategoryRequest
    ): ResponseEntity<CategoryResponse> {
        if (!authManager.canManageResource(user)) {
            requestError(RequestError.CANNOT_ACCESS_REQUESTED_RESOURCE, HttpStatus.FORBIDDEN)
        }

        val savedCategory = categoryService.saveCategory(request.toNew()).awaitSingle()
        return ResponseEntity.ok(CategoryResponse.of(savedCategory))
    }

    @GetMapping("{id}")
    suspend fun getCategory(
        @PathVariable
        id: Long
    ): ResponseEntity<CategoryResponse> {
        val category = categoryService.getCategory(id).awaitFirstOrNull()
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

    @PostMapping("{id}/items")
    suspend fun addItem(
        @WWSUserMetaData
        user: UserMetaData,
        @PathVariable
        id: Long,
        @RequestBody @Valid
        request: NewItemRequest
    ): ResponseEntity<ItemResponse> {
        if (!authManager.canManageResource(user)) {
            requestError(RequestError.CANNOT_ACCESS_REQUESTED_RESOURCE, HttpStatus.FORBIDDEN)
        }

        val category = categoryService.getCategory(id).awaitFirstOrNull()
            ?: return ResponseEntity.notFound().build()

        val savedItem = categoryService.saveNewItem(
            category = category,
            name = request.name,
            description = request.description,
            price = request.price
        ).awaitSingle()

        return ResponseEntity.ok(ItemResponse.of(savedItem))
    }

    @DeleteMapping("{id}")
    suspend fun deleteCategory(
        @WWSUserMetaData
        user: UserMetaData,
        @PathVariable
        id: Long
    ) {
        if (!authManager.canManageResource(user)) {
            requestError(RequestError.CANNOT_ACCESS_REQUESTED_RESOURCE, HttpStatus.FORBIDDEN)
        }

        val category = categoryService.getCategory(id).awaitFirstOrNull()
            ?: return

        categoryService.deleteCategory(category = category)
    }
}