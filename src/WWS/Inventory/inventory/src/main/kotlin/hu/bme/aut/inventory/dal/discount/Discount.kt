package hu.bme.aut.inventory.dal.discount

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDate

@Table
data class Discount(
    @Id @Column("DiscountID")
    var id: Long?,
    @Column("Value")
    var value: Int,
    @Column("StartDate")
    var startDate: LocalDate,
    @Column("EndDate")
    var endDate: LocalDate,
    @Column("Expired")
    var expired: Boolean,
    @Column("CategoryId")
    var categoryId: Long?,
) {
    fun toDomain(): hu.bme.aut.inventory.domain.Discount =
        hu.bme.aut.inventory.domain.Discount(
            id = id,
            value = value,
            startDate = startDate,
            endDate = endDate,
            expired = expired,
            categoryId = categoryId
        )

    companion object {
        fun toDal(discount: hu.bme.aut.inventory.domain.Discount): Discount = discount.let {
            Discount(
                id = it.id,
                value = it.value,
                startDate = it.startDate,
                endDate = it.endDate,
                expired = it.expired,
                categoryId = it.categoryId
            )
        }
    }
}
