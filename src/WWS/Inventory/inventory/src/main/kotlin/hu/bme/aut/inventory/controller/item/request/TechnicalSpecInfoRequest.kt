package hu.bme.aut.inventory.controller.item.request

import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecQuery

object TechnicalSpecInfoRequest {
    fun toTechnicalSpecInfo(queryStr: String): List<TechnicalSpecQuery> {
        val specs = mutableListOf<TechnicalSpecQuery>()

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
                    try {
                        specs.add(
                            TechnicalSpecQuery(
                                technicalSpecificationId = values[0].removePrefix("stId=").toLong(),
                                value = values[1].removePrefix("v="),
                                range = Pair(0, 0)
                            )
                        )
                    } catch (_: NumberFormatException) {}
                } else if (values[0].contains("stId=") && values[1].contains("r=")) {
                    try {
                        val range = values[1].removePrefix("r=").split("-")
                        if (range.size == 2) {
                            specs.add(
                                TechnicalSpecQuery(
                                    technicalSpecificationId = values[0].removePrefix("stId=").toLong(),
                                    value = "",
                                    range = Pair(range[0].toLong(), range[1].toLong())
                                )
                            )
                        }
                    } catch (_: NumberFormatException) {}
                }

            }
        }

        return specs
    }

}
