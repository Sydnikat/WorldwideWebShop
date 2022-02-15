package hu.bme.aut.mail.integrationEvent.event

import com.fasterxml.jackson.annotation.JsonProperty
import java.io.Serializable

data class CategoryPromotionCreatedEvent(
    @JsonProperty("categoryName") val categoryName: String,
    @JsonProperty("discount") val discount: Int,
    @JsonProperty("startDate") val startDate: String,
    @JsonProperty("endDate") val endDate: String,
    @JsonProperty("email") val email: String
) : Serializable