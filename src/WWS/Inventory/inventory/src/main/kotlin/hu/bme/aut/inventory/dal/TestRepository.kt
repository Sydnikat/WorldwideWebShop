package hu.bme.aut.inventory.dal

import org.springframework.data.repository.reactive.ReactiveCrudRepository

interface TestRepository : ReactiveCrudRepository<Person, Long> {
}