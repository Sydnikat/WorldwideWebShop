package hu.bme.aut.inventory.dal

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
    var endDate: LocalDate
)
