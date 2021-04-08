package hu.bme.aut.inventory.controller.common.annotation

import com.fasterxml.jackson.annotation.JacksonAnnotationsInside
import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.annotation.JsonDeserialize

@Retention(AnnotationRetention.RUNTIME)
@JacksonAnnotationsInside
@JsonDeserialize(using = Trim.Deserializer::class)
@Target(AnnotationTarget.FIELD)
annotation class Trim {

    class Deserializer : JsonDeserializer<String?>() {
        override fun deserialize(jp: JsonParser, ctxt: DeserializationContext?) = jp.valueAsString?.trim()
    }

    @Retention(AnnotationRetention.RUNTIME)
    @JacksonAnnotationsInside
    @JsonDeserialize(using = List.Deserializer::class)
    annotation class List {

        class Deserializer : JsonDeserializer<kotlin.collections.List<String?>>() {
            val typeRef = object : TypeReference<kotlin.collections.List<String>>() {}
            override fun deserialize(jp: JsonParser, ctxt: DeserializationContext?) =
                jp.readValueAs<kotlin.collections.List<String?>>(typeRef).map { it?.trim() }
        }
    }
}
