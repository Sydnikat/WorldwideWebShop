package hu.bme.aut.mail.integrationEvent.event

import com.fasterxml.jackson.annotation.JsonProperty
import java.io.Serializable


data class UserRegisteredEvent(
    @JsonProperty("userId") var userId: String = "",
    @JsonProperty("userName") var userName: String = "",
    @JsonProperty("email") var email: String = ""
) : Serializable