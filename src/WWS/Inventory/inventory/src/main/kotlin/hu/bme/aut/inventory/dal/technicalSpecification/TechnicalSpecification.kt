package hu.bme.aut.inventory.dal.technicalSpecification

import hu.bme.aut.inventory.domain.technicalSpecification.BooleanTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.EnumListTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.NumberTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.StringTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecEnumListItem
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
        enumList: List<TechnicalSpecEnumListItem> = listOf()
    ): hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecification {
        if (isNumber) {
            return NumberTechnicalSpecification(
                id = id,
                name = name,
                unitOfMeasure = unitOfMeasure,
                categoryId = categoryId
            )
        }
        if (isBoolean) {
            return BooleanTechnicalSpecification(
                id = id,
                name = name,
                unitOfMeasure = unitOfMeasure,
                categoryId = categoryId
            )
        }
        if (isEnumList) {
            return EnumListTechnicalSpecification(
                id = id,
                name = name,
                unitOfMeasure = unitOfMeasure,
                categoryId = categoryId,
                enumList = enumList.toMutableList()
            )
        }
        else {
            return StringTechnicalSpecification(
                id = id,
                name = name,
                unitOfMeasure = unitOfMeasure,
                categoryId = categoryId
            )
        }
    }

    companion object {
        fun toDal(techSpec: hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecification): TechnicalSpecification = techSpec.let {
            TechnicalSpecification(
                id = it.id,
                name = it.name,
                unitOfMeasure = it.unitOfMeasure,
                categoryId = it.categoryId,
                isNumber = it is NumberTechnicalSpecification,
                isBoolean = it is BooleanTechnicalSpecification,
                isString = it is StringTechnicalSpecification,
                isEnumList = it is EnumListTechnicalSpecification,
            )
        }
    }
}
