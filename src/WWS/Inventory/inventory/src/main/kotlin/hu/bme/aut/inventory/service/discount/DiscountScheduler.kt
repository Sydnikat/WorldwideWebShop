package hu.bme.aut.inventory.service.discount

import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.LocalDate

@Component
class DiscountScheduler(
    private val discountService: DiscountService
) {

    @Scheduled(cron = "0 0 2 1/1 * *") // Every day at 2:00 am
    suspend fun handleExpiredDiscounts() {
        val date = LocalDate.now()
        val expiringDiscounts = discountService.getAllExpiringDiscounts(date)
        discountService.handleExpiredDiscounts(expiringDiscounts)
    }
}