package hu.bme.aut.inventory.dal.technicalSpecification

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("TechnicalSpecEnumListItem")
data class TechnicalSpecEnumListItem(
    @Id @Column("TechnicalSpecEnumListItemID")
    var id: Long?,
    @Column("EnumName")
    var enumName: String,
    @Column("TechnicalSpecificationId")
    var technicalSpecificationId: Long,
) {
    fun toDomain(): hu.bme.aut.inventory.domain.TechnicalSpecEnumListItem =
        hu.bme.aut.inventory.domain.TechnicalSpecEnumListItem(
            id,
            enumName,
            technicalSpecificationId
        )

    companion object {
        fun toDal(listItem: hu.bme.aut.inventory.domain.TechnicalSpecEnumListItem): TechnicalSpecEnumListItem = listItem.let {
            TechnicalSpecEnumListItem(
                it.id,
                it.enumName,
                it.technicalSpecificationId
            )
        }
    }
}
