package hu.bme.aut.inventory.controller

import hu.bme.aut.inventory.dal.TestRepository
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.reactive.awaitFirstOrNull
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactive.awaitSingleOrElse
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.lang.Exception

@RestController
@RequestMapping("/test")
class TestController(
    private val testRepository: TestRepository
) {

    @GetMapping
    suspend fun testEndpoint(): ResponseEntity<String> {
        return try {
            val people = testRepository.findAll().asFlow().toList()
            ResponseEntity.ok("Test data: $people")
        } catch (e: Exception) {
            ResponseEntity.ok("Exception: ${e.message}")
        }

    }
}