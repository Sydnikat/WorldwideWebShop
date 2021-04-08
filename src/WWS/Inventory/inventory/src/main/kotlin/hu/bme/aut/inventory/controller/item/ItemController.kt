package hu.bme.aut.inventory.controller.item

import hu.bme.aut.inventory.controller.item.request.UpdateItemRequest
import hu.bme.aut.inventory.controller.item.response.ItemResponse
import hu.bme.aut.inventory.service.item.ItemService
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirst
import kotlinx.coroutines.reactive.awaitSingle
import org.springframework.data.domain.PageRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import javax.validation.Valid

@RestController
@RequestMapping("/items")
class ItemController(
    private val itemService: ItemService
) {
    @GetMapping("{id}")
    suspend fun getItem(
        @PathVariable
        id: Long
    ): ResponseEntity<ItemResponse> {
        val item = itemService.getItem(id).awaitFirst()
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(ItemResponse.of(item))
    }

    @GetMapping
    suspend fun getItems(
        @RequestParam(required = false)
        offset: Int?,
        @RequestParam(required = false)
        size: Int?
    ): ResponseEntity<List<ItemResponse>> {
        val pageable = PageRequest.of(offset ?: 0, size ?: 20)
        return ResponseEntity.ok(
            itemService.getItems(pageable)
                .asFlow()
                .toList()
                .map { ItemResponse.of(it) }
        )
    }

    @PutMapping("{id}")
    suspend fun updateItem(
        @PathVariable
        id: Long,
        @RequestBody @Valid
        request: UpdateItemRequest
    ): ResponseEntity<ItemResponse> {
        val item = itemService.getItem(id).awaitFirst()
            ?: return ResponseEntity.notFound().build()

        val updatedItem = itemService.updateItem(item, request.toPatchData()).awaitSingle()

        return ResponseEntity.ok(ItemResponse.of(updatedItem))
    }
}