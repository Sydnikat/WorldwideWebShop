package hu.bme.aut.inventory.domain
import java.time.LocalDate

data class Review(
    val id: Long?,
    val itemId: Long,
    val reviewerName: String,
    val reviewerId: String,
    val summary: String,
    val rating: Float,
    val created: LocalDate
)
