package hu.bme.aut.inventory.dal.technicalSpecification

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("TechnicalSpecInfo")
data class TechnicalSpecInfo(
    @Id @Column("TechnicalSpecInfoID")
    var id: Long?,
    @Column("TechnicalSpecificationId")
    var technicalSpecificationId: Long,
    @Column("ItemId")
    var itemId: Long,
    @Column("ValueString")
    var value: String,
) {
    fun toDomain(): hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecInfo =
        hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecInfo(
            id = id,
            technicalSpecificationId = technicalSpecificationId,
            itemId = itemId,
            value = value
        )

    companion object {
        fun toDal(specInfo: hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecInfo): TechnicalSpecInfo = specInfo.let {
            TechnicalSpecInfo(
                id = it.id,
                technicalSpecificationId = it.technicalSpecificationId,
                itemId = it.itemId,
                value = it.value
            )
        }
    }
}
