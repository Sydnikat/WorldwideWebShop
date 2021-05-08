package hu.bme.aut.mail.integrationEvent.event

import com.fasterxml.jackson.annotation.JsonProperty
import java.io.Serializable

data class InvoiceCreatedEvent(
    @JsonProperty("orderCode") val orderCode: String,
    @JsonProperty("totalPrice") val totalPrice: Double,
    @JsonProperty("created") val created: String,
    @JsonProperty("zip") val zip: String,
    @JsonProperty("city") val city: String,
    @JsonProperty("street") val street: String,
    @JsonProperty("countryCode") val countryCode: String,
    @JsonProperty("email") val email: String,
) : Serializable