package hu.bme.aut.inventory.service.common.exception

class TechnicalSpecificationNotFoundForInfo(val missingTechSpecId: Long, val value: String) : Exception()
class TechnicalSpecificationInfoValueIsInvalid(val techSpecId: Long, val value: String) : Exception()
class MultipleTechnicalSpecificationReference(val techSpecId: Long, val values: List<String>) : Exception()