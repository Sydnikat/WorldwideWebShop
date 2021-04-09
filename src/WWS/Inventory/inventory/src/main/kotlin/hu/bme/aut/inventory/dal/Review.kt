package hu.bme.aut.inventory.dal

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDate

@Table
data class Review(
    @Id @Column("ReviewID")
    var id: Long?,
    @Column("ItemID")
    val itemId: Long,
    @Column("ReviewerName")
    val reviewerName: String,
    @Column("ReviewerID")
    val reviewerId: String,
    @Column("Summary")
    var summary: String,
    @Column("Rating")
    var rating: Float,
    @Column("Created")
    var created: LocalDate
)
