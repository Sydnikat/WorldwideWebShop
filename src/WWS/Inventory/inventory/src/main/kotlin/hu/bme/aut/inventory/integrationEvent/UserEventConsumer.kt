package hu.bme.aut.inventory.integrationEvent

import hu.bme.aut.inventory.integrationEvent.event.OrderCreatedEvent
import hu.bme.aut.inventory.service.item.ItemService
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import kotlinx.coroutines.runBlocking
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener
import org.springframework.stereotype.Service

@Service
class OrderCreatedEventConsumer(
    private val itemService: ItemService
) {
    @RabbitListener(queues = ["\${rabbitmq.order.orderCreatedQueue}"])
    @RabbitHandler
    fun orderCreatedEventListenerSpecific(event: OrderCreatedEvent) {
        runBlocking {
            val itemIds = event.items.map { it.itemId }
            val existingItems = itemService.getItems(itemIds).asFlow().toList()

            event.items.forEach { i ->
                val existingItem = existingItems.first { it.id == i.itemId }
                existingItem.stock -= i.count
            }

            itemService.saveItems(existingItems).asFlow().toList()
        }
    }
}

