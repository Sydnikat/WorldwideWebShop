package hu.bme.aut.inventory.service.common

import hu.bme.aut.inventory.domain.category.Category
import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecInfo
import hu.bme.aut.inventory.service.common.exception.MultipleTechnicalSpecificationReference
import hu.bme.aut.inventory.service.common.exception.TechnicalSpecificationInfoValueIsInvalid
import hu.bme.aut.inventory.service.common.exception.TechnicalSpecificationNotFoundForInfo
import kotlin.jvm.Throws

object TechSpecInfoValidator {
    @Throws(
        TechnicalSpecificationNotFoundForInfo::class,
        TechnicalSpecificationInfoValueIsInvalid::class
    )
    fun validateListOfTechSpecInfo(category: Category, listOfTechnicalSpecInfo: List<TechnicalSpecInfo>) {
        val techSpecs = category.technicalSpecifications
        techSpecs.forEach { ts ->
            val connectedInfo = listOfTechnicalSpecInfo.filter { info -> info.technicalSpecificationId == ts.id }
            if (connectedInfo.size > 1) {
                throw MultipleTechnicalSpecificationReference(ts.id!!, connectedInfo.map { it.value })
            }
        }

        listOfTechnicalSpecInfo.forEach { info ->
            val relevantTechSpec = techSpecs.find { ts -> ts.id == info.technicalSpecificationId }
            if (relevantTechSpec == null) {
                throw TechnicalSpecificationNotFoundForInfo(info.technicalSpecificationId, info.value)
            } else {
                if (!relevantTechSpec.checkValue(info.value)) {
                    throw TechnicalSpecificationInfoValueIsInvalid(relevantTechSpec.id!!, info.value)
                }
            }
        }
    }
}