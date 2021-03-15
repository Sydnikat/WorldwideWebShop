package hu.bme.aut.inventory.dal

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table

@Table
data class Person(
    @Id
    var id: Long,
    val name: String,
    var age: Int
)