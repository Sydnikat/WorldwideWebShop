package hu.bme.aut.inventory.service.discount


import hu.bme.aut.inventory.dal.Discount
import hu.bme.aut.inventory.dal.DiscountRepository
import hu.bme.aut.inventory.dal.Item
import hu.bme.aut.inventory.dal.ItemRepository
import hu.bme.aut.inventory.service.discount.exception.DiscountOutOfRangeException
import hu.bme.aut.inventory.service.discount.exception.EndDateMustBeFutureDateException
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitSingle
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.LocalDate
import kotlin.jvm.Throws

@Service
class DiscountService(
    private val discountRepository: DiscountRepository,
    private val itemRepository: ItemRepository
) {
    suspend fun getDiscount(discountId: Long): Mono<Discount?> =
        discountRepository.findById(discountId)

    suspend fun getDiscounts(pageable: Pageable = Pageable.unpaged()): Flux<Discount> =
        discountRepository.findAllByIdNotNull(pageable)

    suspend fun getDiscounts(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): Flux<Discount> =
        discountRepository.findAllByIdIn(ids = ids, pageable = pageable)

    suspend fun getAllExpiringDiscounts(date: LocalDate): Flux<Discount> =
        discountRepository.findAllByExpiredFalseAndEndDateLessThanEqual(date = date)

    @Throws(
        DiscountOutOfRangeException::class,
        EndDateMustBeFutureDateException::class
    )
    suspend fun saveDiscount(discountValue: Int, endDate: LocalDate, items: List<Item>): Mono<Discount> {
        if (discountValue > 100) {
            throw DiscountOutOfRangeException(discountValue)
        }

        val startDate = LocalDate.now()
        if (endDate <= startDate) {
            throw EndDateMustBeFutureDateException(endDate)
        }

        val newDiscount = Discount(
            id = null,
            value = discountValue,
            startDate = startDate,
            endDate = endDate,
            expired = false
        )

        val savedDiscount = discountRepository.save(newDiscount).awaitSingle()

        items.forEach {
            it.discountId = savedDiscount.id!!
            it.discount = savedDiscount.value.toLong()
        }
        itemRepository.saveAll(items)

        return Mono.just(savedDiscount)
    }

    suspend fun handleExpiredDiscounts(discounts: List<Discount>) {
        discounts.forEach {
            val connectedItems = itemRepository.findAllByDiscountId(it.id!!).asFlow().toList()
            connectedItems.forEach { item ->
                item.discountId = null
                item.discount = null
            }
            itemRepository.saveAll(connectedItems)

            it.expired = true
        }
        discountRepository.saveAll(discounts)
    }

    suspend fun deleteDiscount(discount: Discount) {
        val connectedItems = itemRepository.findAllByDiscountId(discount.id!!).asFlow().toList()
        connectedItems.forEach { item ->
            item.discountId = null
            item.discount = null
        }
        itemRepository.saveAll(connectedItems)

        discountRepository.delete(discount)
    }

}