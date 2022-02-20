package hu.bme.aut.inventory.controller.item.request

import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecInfo

object TechnicalSpecInfoRequest {
    fun toTechnicalSpecInfo(queryStr: String): List<TechnicalSpecInfo> {
        val specs = mutableListOf<TechnicalSpecInfo>()

        if (queryStr.isBlank())
            return specs

        if (queryStr.length < 2)
            return specs

        val hasFrame = queryStr[0] == '(' || queryStr[queryStr.length -1] == ')'
        if (!hasFrame)
            return specs

        val withoutFrames = queryStr.substring(1, queryStr.length -1)
        val listOfSpecStr = withoutFrames.split(";")

        listOfSpecStr.forEach { str ->
            val values = str.split(",")
            if (values.size == 2) {
                if (values[0].contains("stId=") && values[1].contains("v=")) {
                    specs.add(
                        TechnicalSpecInfo(
                            id = null,
                            technicalSpecificationId = values[0].removePrefix("stId=").toLong(),
                            value = values[1].removePrefix("v="),
                            itemId = 0
                        )
                    )
                }
            }
        }

        return specs
    }

}
