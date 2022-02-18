package hu.bme.aut.inventory.service.discount


import hu.bme.aut.inventory.domain.Discount
import hu.bme.aut.inventory.dal.discount.DiscountRepository
import hu.bme.aut.inventory.domain.Item
import hu.bme.aut.inventory.dal.item.ItemRepository
import hu.bme.aut.inventory.service.discount.exception.DiscountOutOfRangeException
import hu.bme.aut.inventory.service.discount.exception.EndDateMustBeFutureDateException
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.time.LocalDate
import kotlin.jvm.Throws

@Service
class DiscountService(
    private val discountRepository: DiscountRepository,
    private val itemRepository: ItemRepository
) {
    suspend fun getDiscount(discountId: Long): Discount? =
        discountRepository.findById(discountId)

    suspend fun getDiscounts(pageable: Pageable = Pageable.unpaged()): List<Discount> =
        discountRepository.findAllByIdNotNull(pageable)

    suspend fun getDiscounts(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): List<Discount> =
        discountRepository.findAllByIdIn(ids = ids, pageable = pageable)

    suspend fun getAllExpiringDiscounts(date: LocalDate): List<Discount> =
        discountRepository.findAllByExpiredAndEndDateLessThanEqual(expired = false, date = date)

    @Throws(
        DiscountOutOfRangeException::class,
        EndDateMustBeFutureDateException::class
    )
    suspend fun saveDiscount(
        discountValue: Int,
        endDate: LocalDate,
        items: List<Item>,
        categoryId: Long? = null
    ): Discount {
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
            expired = false,
            categoryId = categoryId
        )

        if (categoryId !== null) {
            val expiringDiscounts = discountRepository
                .findAllByExpiredAndCategoryIdOrderByEndDateDesc(expired = false, categoryId = categoryId)

            if (expiringDiscounts.isNotEmpty()) {
                expiringDiscounts.forEach { it.expired = true }
                discountRepository.saveAll(expiringDiscounts)
            }
        }

        val savedDiscount = discountRepository.save(newDiscount)

        items.forEach {
            it.discountId = savedDiscount.id!!
            it.discount = savedDiscount.value.toLong()
        }

        itemRepository.saveAll(items)

        return savedDiscount
    }

    suspend fun handleExpiredDiscounts(discounts: List<Discount>) {
        discounts.forEach {
            val connectedItems = itemRepository.findAllByDiscountId(it.id!!)
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
        val connectedItems = itemRepository.findAllByDiscountId(discount.id!!)
        connectedItems.forEach { item ->
            item.discountId = null
            item.discount = null
        }
        itemRepository.saveAll(connectedItems)

        discountRepository.deleteById(discount.id)
    }

}