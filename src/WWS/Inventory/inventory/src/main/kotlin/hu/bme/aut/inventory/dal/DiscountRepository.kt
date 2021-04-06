package hu.bme.aut.inventory.dal

import org.springframework.data.repository.reactive.ReactiveCrudRepository
import org.springframework.stereotype.Repository

@Repository
interface DiscountRepository : ReactiveCrudRepository<Discount, Long> {
}