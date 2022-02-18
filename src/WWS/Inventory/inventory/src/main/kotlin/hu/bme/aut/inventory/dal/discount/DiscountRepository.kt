package hu.bme.aut.inventory.dal.discount

import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactive.awaitSingleOrNull
import org.springframework.data.domain.Pageable
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import java.time.LocalDate

@Service
class DiscountRepository(
    private val discountCRUDRepository: DiscountCRUDRepository
) {
    suspend fun findById(discountId: Long): hu.bme.aut.inventory.domain.Discount? {
        return discountCRUDRepository.findById(discountId).awaitFirstOrNull()?.toDomain()
    }

    suspend fun findAllByIdIn(
        ids: List<Long>,
        pageable: Pageable = Pageable.unpaged()
    ): List<hu.bme.aut.inventory.domain.Discount> {
        return discountCRUDRepository
            .findAllByIdIn(ids, pageable)
            .asFlow()
            .toList()
            .map { it.toDomain() }
    }

    suspend fun findAllByIdNotNull(
        pageable: Pageable = Pageable.unpaged()
    ): List<hu.bme.aut.inventory.domain.Discount> {
        return discountCRUDRepository
            .findAllByIdNotNull(pageable)
            .asFlow()
            .toList()
            .map { it.toDomain() }
    }

    suspend fun findAllByCategoryId(
        categoryId: Long
    ): List<hu.bme.aut.inventory.domain.Discount> {
        return discountCRUDRepository
            .findAllByCategoryId(categoryId)
            .asFlow()
            .toList()
            .map { it.toDomain() }
    }

    suspend fun findAllByExpiredAndEndDateLessThanEqual(
        expired: Boolean,
        date: LocalDate
    ): List<hu.bme.aut.inventory.domain.Discount> {
        return discountCRUDRepository
            .findAllByExpiredAndEndDateLessThanEqual(expired, date)
            .asFlow()
            .toList()
            .map { it.toDomain() }
    }

    suspend fun findAllByExpiredAndCategoryIdOrderByEndDateDesc(
        expired: Boolean,
        categoryId: Long
    ): List<hu.bme.aut.inventory.domain.Discount> {
        return discountCRUDRepository
            .findAllByExpiredAndCategoryIdOrderByEndDateDesc(expired, categoryId)
            .asFlow()
            .toList()
            .map { it.toDomain() }
    }

    suspend fun save(discount: hu.bme.aut.inventory.domain.Discount): hu.bme.aut.inventory.domain.Discount {
        return discountCRUDRepository.save(Discount.toDal(discount)).awaitSingle().toDomain()
    }

    suspend fun saveAll(
        discounts: List<hu.bme.aut.inventory.domain.Discount>
    ): List<hu.bme.aut.inventory.domain.Discount> {
        return discountCRUDRepository
            .saveAll(discounts.map { Discount.toDal(it) })
            .asFlow()
            .toList()
            .map { it.toDomain() }
    }

    suspend fun deleteById(discountId: Long) {
        discountCRUDRepository.deleteById(discountId).awaitSingleOrNull()
    }

    suspend fun deleteAll(discounts: List<hu.bme.aut.inventory.domain.Discount>) {
        discountCRUDRepository.deleteAll(discounts.map { Discount.toDal(it) }).awaitSingleOrNull()
    }
}