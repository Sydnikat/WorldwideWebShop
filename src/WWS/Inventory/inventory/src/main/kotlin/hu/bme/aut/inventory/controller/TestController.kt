package hu.bme.aut.inventory.controller

import hu.bme.aut.inventory.dal.CategoryRepository
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.lang.Exception

@RestController
@RequestMapping("/test")
class TestController(
    private val categoryRepository: CategoryRepository
) {

    @GetMapping
    suspend fun testEndpoint(): ResponseEntity<String> {
        return try {
            val p = PageRequest.of(0, 1, Sort.by("id").descending())
            val people = categoryRepository.findAllByIdIn(listOf(1,2,3), p).asFlow().toList()
            ResponseEntity.ok("Test data: $people")
        } catch (e: Exception) {
            ResponseEntity.ok("Exception: ${e.message}")
        }

    }
}