package hu.bme.aut.inventory.dal

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface ReviewRepository : ReactiveCrudRepository<Review, Long> {
}