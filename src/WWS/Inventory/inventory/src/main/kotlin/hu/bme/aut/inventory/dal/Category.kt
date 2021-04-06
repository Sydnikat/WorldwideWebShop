package hu.bme.aut.inventory.dal

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table
data class Category(
    @Id @Column("CategoryID")
    var id: Long?,
    @Column("Name")
    val name: String
)
