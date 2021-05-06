package hu.bme.aut.inventory.controller.discount

import hu.bme.aut.inventory.config.resolver.UserMetaData
import hu.bme.aut.inventory.config.resolver.WWSUserMetaData
import hu.bme.aut.inventory.controller.discount.request.NewDiscountRequest
import hu.bme.aut.inventory.controller.discount.response.DiscountResponse
import hu.bme.aut.inventory.dal.Item
import hu.bme.aut.inventory.exception.RequestError
import hu.bme.aut.inventory.service.auth.AuthManager
import hu.bme.aut.inventory.service.discount.DiscountService
import hu.bme.aut.inventory.service.discount.exception.DiscountOutOfRangeException
import hu.bme.aut.inventory.service.discount.exception.EndDateMustBeFutureDateException
import hu.bme.aut.inventory.service.item.ItemService
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
@RequestMapping("/api/inventory/discounts")
class DiscountController(
    private val discountService: DiscountService,
    private val itemService: ItemService,
    private val authManager: AuthManager
) {

    @PostMapping
    suspend fun createDiscount(
        @WWSUserMetaData
        user: UserMetaData,
        @RequestBody @Valid
        request: NewDiscountRequest
    ): ResponseEntity<DiscountResponse> {
        if (!authManager.canManageResource(user)) {
            requestError(RequestError.CANNOT_ACCESS_REQUESTED_RESOURCE, HttpStatus.FORBIDDEN)
        }

        val items = when {
            request.categoryId != null -> {
                itemService.getItems(categoryId = request.categoryId).asFlow().toList()
            }
            request.itemIds != null -> {
                itemService.getItems(request.itemIds).asFlow().toList()
            }
            else -> listOf<Item>()
        }

       try {
           val savedDiscount = discountService.saveDiscount(
               discountValue = request.value,
               endDate = request.endDate,
               items = items
           ).awaitSingle()

           // TODO: Possible email notification?

           return ResponseEntity.ok(DiscountResponse.of(savedDiscount))
       } catch (e: DiscountOutOfRangeException) {
           requestError(
               RequestError.DISCOUNT_VALUE_MUST_BE_VALID,
               HttpStatus.BAD_REQUEST,
               "discount value" to e.value
           )
       } catch (e: EndDateMustBeFutureDateException) {
           requestError(
               RequestError.DISCOUNT_END_DATE_MUST_BE_FUTURE_DATE,
               HttpStatus.BAD_REQUEST,
               "end date" to e.date
           )
       }
    }

    @GetMapping("{id}")
    suspend fun getDiscount(
        @WWSUserMetaData
        user: UserMetaData,
        @PathVariable
        id: Long
    ): ResponseEntity<DiscountResponse> {
        if (!authManager.canManageResource(user)) {
            requestError(RequestError.CANNOT_ACCESS_REQUESTED_RESOURCE, HttpStatus.FORBIDDEN)
        }

        val discount = discountService.getDiscount(id).awaitFirstOrNull()
            ?: return ResponseEntity.notFound().build()

        return ResponseEntity.ok(DiscountResponse.of(discount))
    }

    @GetMapping
    suspend fun getDiscounts(
        @WWSUserMetaData
        user: UserMetaData,
        @RequestParam(required = false)
        offset: Int?,
        @RequestParam(required = false)
        size: Int?
    ): ResponseEntity<List<DiscountResponse>> {
        if (!authManager.canManageResource(user)) {
            requestError(RequestError.CANNOT_ACCESS_REQUESTED_RESOURCE, HttpStatus.FORBIDDEN)
        }

        val pageable = PageRequest.of(offset ?: 0, size ?: 20)
        return ResponseEntity.ok(
            discountService.getDiscounts(pageable)
                .asFlow()
                .toList()
                .map { DiscountResponse.of(it) }
        )
    }

    @DeleteMapping("{id}")
    suspend fun deleteDiscount(
        @WWSUserMetaData
        user: UserMetaData,
        @PathVariable
        id: Long
    ) {
        if (!authManager.canManageResource(user)) {
            requestError(RequestError.CANNOT_ACCESS_REQUESTED_RESOURCE, HttpStatus.FORBIDDEN)
        }

        val discount = discountService.getDiscount(id).awaitFirstOrNull()
            ?: return

        discountService.deleteDiscount(discount = discount)
    }
}