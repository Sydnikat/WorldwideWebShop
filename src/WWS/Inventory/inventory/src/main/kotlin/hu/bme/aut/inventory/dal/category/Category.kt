package hu.bme.aut.inventory.dal.category

import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecification
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
        techSpecs: List<TechnicalSpecification> = listOf()
    ): hu.bme.aut.inventory.domain.category.Category =
        hu.bme.aut.inventory.domain.category.Category(
            id,
            name,
            techSpecs.toMutableList()
        )

    companion object {
        fun toDal(category: hu.bme.aut.inventory.domain.category.Category) = category.let {
            Category(
                it.id,
                it.name
            )
        }
    }
}
