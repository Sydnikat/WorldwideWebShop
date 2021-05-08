package hu.bme.aut.inventory.integrationEvent.event

import com.fasterxml.jackson.annotation.JsonProperty
import java.io.Serializable

data class OrderCreatedEvent(
    @JsonProperty("orderCode") val orderCode: String,
    @JsonProperty("customerId") val customerId: String,
    @JsonProperty("items") val items: List<OrderItem>
) : Serializable

data class OrderItem(
    @JsonProperty("itemId") val itemId: Long,
    @JsonProperty("count") val count: Int,
) : Serializable