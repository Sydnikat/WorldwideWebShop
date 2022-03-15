package hu.bme.aut.inventory.controller.category

import hu.bme.aut.inventory.config.resolver.UserMetaData
import hu.bme.aut.inventory.config.resolver.WWSUserMetaData
import hu.bme.aut.inventory.controller.category.request.NewCategoryRequest
import hu.bme.aut.inventory.controller.category.request.TechnicalSpecificationUpdateRequest
import hu.bme.aut.inventory.controller.category.response.CategoryResponse
import hu.bme.aut.inventory.controller.item.request.NewItemRequest
import hu.bme.aut.inventory.controller.item.response.ItemResponse
import hu.bme.aut.inventory.domain.item.Item
import hu.bme.aut.inventory.domain.technicalSpecification.EnumListTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecEnumListItem
import hu.bme.aut.inventory.exception.RequestError
import hu.bme.aut.inventory.service.auth.AuthManager
import hu.bme.aut.inventory.service.category.CategoryService
import hu.bme.aut.inventory.service.common.exception.MultipleTechnicalSpecificationReference
import hu.bme.aut.inventory.service.common.exception.TechnicalSpecificationInfoValueIsInvalid
import hu.bme.aut.inventory.service.common.exception.TechnicalSpecificationNotFoundForInfo
import hu.bme.aut.inventory.service.item.ItemService
import hu.bme.aut.inventory.util.requestError
import org.springframework.data.domain.PageRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

@RestController
@RequestMapping("/api/inventory/categories")
class CategoryController(
    private val categoryService: CategoryService,
    private val itemService: ItemService,
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

        request.technicalSpecificationRequests.forEach { r ->
            if (!r.isValid())
                requestError(
                    RequestError.TECH_SPEC_HAS_NO_TYPE,
                    HttpStatus.BAD_REQUEST,
                    "techSpec name" to r.name
                )
        }

        val savedCategory = categoryService.saveCategory(request.toNew())

        val savedTechSpecs = request.technicalSpecificationRequests.map { techSpecRequest ->
            categoryService
                .saveTechnicalSpecification(techSpecRequest.toNew(savedCategory.id!!))
                .let { techSpec ->
                    if (techSpec is EnumListTechnicalSpecification && techSpecRequest.listOfEnumNames.isNotEmpty()) {
                        techSpecRequest.listOfEnumNames
                            .map { TechnicalSpecEnumListItem(null, it, techSpec.id!!) }
                            .also { techSpec.enumList.addAll(it) }
                        categoryService.saveTechnicalSpecification(techSpec)
                    } else {
                        techSpec
                    }
                }
        }

        savedCategory.technicalSpecifications.addAll(savedTechSpecs)

        return ResponseEntity.ok(CategoryResponse.of(savedCategory))
    }

    @PutMapping("{id}/techSpecs")
    suspend fun updateTechnicalSpecifications(
        @WWSUserMetaData
        user: UserMetaData,
        @PathVariable
        id: Long,
        @RequestBody
        techSpecsRequests: List<TechnicalSpecificationUpdateRequest>
    ): ResponseEntity<CategoryResponse> {
        if (!authManager.canManageResource(user)) {
            requestError(RequestError.CANNOT_ACCESS_REQUESTED_RESOURCE, HttpStatus.FORBIDDEN)
        }

        techSpecsRequests.forEach { r ->
            if (!r.isValid())
                requestError(
                    RequestError.TECH_SPEC_HAS_NO_TYPE,
                    HttpStatus.BAD_REQUEST,
                    "techSpec name" to r.name
                )
        }

        val category = categoryService.getCategory(id)
            ?: requestError(RequestError.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND)

        category.technicalSpecifications
            .filter { ts -> !techSpecsRequests.map { it.id }.contains(ts.id) }
            .also { categoryService.deleteTechnicalSpecifications(it) }

        val savedTechSpecs = techSpecsRequests.map { techSpecRequest ->
            categoryService
                .saveTechnicalSpecification(techSpecRequest.to(id))
                .let { techSpec ->
                    if (techSpec is EnumListTechnicalSpecification && techSpecRequest.listOfEnumItems.isNotEmpty()) {
                        techSpecRequest.listOfEnumItems
                            .filter { it.technicalSpecificationId == null }
                            .map { TechnicalSpecEnumListItem(null, it.enumName, techSpec.id!!) }
                            .also { techSpec.enumList.addAll(it) }
                        categoryService.saveTechnicalSpecification(techSpec)
                    } else {
                        techSpec
                    }
                }
        }.toMutableList()

        val updatedCategory = category.copy(technicalSpecifications = savedTechSpecs)

        return ResponseEntity.ok(CategoryResponse.of(updatedCategory))
    }

    @GetMapping("{id}")
    suspend fun getCategory(
        @PathVariable
        id: Long
    ): ResponseEntity<CategoryResponse> {
        val category = categoryService.getCategory(id)
            ?: requestError(RequestError.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND)

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

        val category = categoryService.getCategory(id)
            ?: requestError(RequestError.CATEGORY_NOT_FOUND, HttpStatus.NOT_FOUND)

        var savedItem: Item? = null
        try {
            savedItem = categoryService.saveNewItem(category, request.toNew(category.id!!))

            val updatedItem = if (request.listOfTechnicalSpecInfo.isNotEmpty()) {
                val listOfTechSpecInfo = request.listOfTechnicalSpecInfo.map { it.to(savedItem.id!!) }
                val patchData = savedItem.copy(listOfTechnicalSpecInfo = listOfTechSpecInfo)

                itemService.updateItem(category = category, item = savedItem, patchData = patchData)
            } else savedItem

            return ResponseEntity.ok(ItemResponse.of(updatedItem))
        } catch (e: TechnicalSpecificationNotFoundForInfo) {
            if (savedItem != null) {
                itemService.deleteItem(savedItem)
            }
            requestError(
                RequestError.SPEC_INFO_INVALID,
                HttpStatus.BAD_REQUEST,
                "missing techSpecId" to e.missingTechSpecId,
                "invalid value" to e.value
            )
        } catch (e: TechnicalSpecificationInfoValueIsInvalid) {
            if (savedItem != null) {
                itemService.deleteItem(savedItem)
            }
            requestError(
                RequestError.SPEC_INFO_INVALID,
                HttpStatus.BAD_REQUEST,
                "techSpecId" to e.techSpecId,
                "invalid value" to e.value
            )
        } catch (e: MultipleTechnicalSpecificationReference) {
            if (savedItem != null) {
                itemService.deleteItem(savedItem)
            }
            requestError(
                RequestError.SPEC_INFO_INVALID,
                HttpStatus.BAD_REQUEST,
                "techSpecId" to e.techSpecId,
                "multiple values" to e.values.joinToString(", ")
            )
        }

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

        val category = categoryService.getCategory(id)
            ?: return

        categoryService.deleteCategory(category = category)
    }

    @GetMapping("{id}/items")
    suspend fun getItems(
        @PathVariable
        id: Long,
        @RequestParam(required = false)
        offset: Int?,
        @RequestParam(required = false)
        size: Int?
    ): ResponseEntity<List<ItemResponse>> {
        val pageable = PageRequest.of(offset ?: 0, size ?: 20)
        return ResponseEntity.ok(
            itemService.getItems(categoryId = id, pageable = pageable)
                .map { ItemResponse.of(it) }
        )
    }
}