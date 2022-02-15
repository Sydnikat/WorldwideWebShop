package hu.bme.aut.inventory.integrationEvent.event

import com.fasterxml.jackson.annotation.JsonProperty
import java.io.Serializable
import java.time.LocalDate

data class CategoryDiscountCreatedEvent(
    @JsonProperty("categoryName") val categoryName: String,
    @JsonProperty("discount") val discount: Int,
    @JsonProperty("startDate") val startDate: String,
    @JsonProperty("endDate") val endDate: String
) : Serializable