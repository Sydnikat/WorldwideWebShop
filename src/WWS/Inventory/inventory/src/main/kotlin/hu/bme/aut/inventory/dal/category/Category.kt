package hu.bme.aut.inventory.dal.category

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table
data class Category(
    @Id @Column("CategoryID")
    var id: Long?,
    @Column("Name")
    val name: String
) {
    fun toDomain(
        techSpecs: List<hu.bme.aut.inventory.domain.TechnicalSpecification> = listOf()
    ): hu.bme.aut.inventory.domain.Category =
        hu.bme.aut.inventory.domain.Category(
            id,
            name,
            techSpecs.toMutableList()
        )

    companion object {
        fun toDal(category: hu.bme.aut.inventory.domain.Category) = category.let {
            Category(
                it.id,
                it.name
            )
        }
    }
}
