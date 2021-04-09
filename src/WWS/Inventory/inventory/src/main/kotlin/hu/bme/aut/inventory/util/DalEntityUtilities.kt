package hu.bme.aut.inventory.util

import hu.bme.aut.inventory.dal.Item

fun Item.increaseRating(rating: Int): Item {
    val newRating = (((this.rating ?: 0.0F) * this.ratingCount) + rating.toFloat()) / (this.ratingCount + 1)

    this.ratingCount += 1
    this.rating = newRating

    return this
}

fun Item.decreaseRating(rating: Int): Item {
    val newRating = (((this.rating ?: 0.0F) * this.ratingCount) - rating.toFloat()) / (this.ratingCount - 1)

    this.ratingCount -= 1
    this.rating = newRating

    return this
}