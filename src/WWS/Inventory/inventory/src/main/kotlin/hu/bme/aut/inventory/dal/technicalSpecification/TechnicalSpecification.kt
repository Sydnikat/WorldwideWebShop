package hu.bme.aut.inventory.dal.technicalSpecification

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

@Table("TechnicalSpecification")
data class TechnicalSpecification(
    @Id @Column("TechnicalSpecificationID")
    var id: Long?,
    @Column("Name")
    var name: String,
    @Column("UnitOfMeasure")
    var unitOfMeasure: String?,
    @Column("CategoryId")
    var categoryId: Long,
    @Column("IsNumber")
    var isNumber: Boolean,
    @Column("IsBoolean")
    var isBoolean: Boolean,
    @Column("IsString")
    var isString: Boolean,
    @Column("IsEnumList")
    var isEnumList: Boolean
) {
    fun toDomain(
        enumList: List<hu.bme.aut.inventory.domain.TechnicalSpecEnumListItem> = listOf()
    ): hu.bme.aut.inventory.domain.TechnicalSpecification =
        hu.bme.aut.inventory.domain.TechnicalSpecification(
            id = id,
            name = name,
            unitOfMeasure = unitOfMeasure,
            categoryId = categoryId,
            isNumber = isNumber,
            isBoolean = isBoolean,
            isString = isString,
            isEnumList = isEnumList,
            enumList = enumList.toMutableList()
        )

    companion object {
        fun toDal(techSpec: hu.bme.aut.inventory.domain.TechnicalSpecification): TechnicalSpecification = techSpec.let {
            TechnicalSpecification(
                id = it.id,
                name = it.name,
                unitOfMeasure = it.unitOfMeasure,
                categoryId = it.categoryId,
                isNumber = it.isNumber,
                isBoolean = it.isBoolean,
                isString = it.isString,
                isEnumList = it.isEnumList,
            )
        }
    }
}
