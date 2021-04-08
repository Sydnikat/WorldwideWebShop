package hu.bme.aut.inventory.controller.review.request

import hu.bme.aut.inventory.controller.common.annotation.Trim
import javax.validation.constraints.NotBlank
import javax.validation.constraints.PositiveOrZero

data class NewReviewRequest(
    @field:[Trim NotBlank]
    val reviewerName: String,

    @field:[Trim NotBlank]
    val reviewerId: String,

    @field:[Trim NotBlank]
    val summary: String,

    @field:[PositiveOrZero]
    val rating: Int
)