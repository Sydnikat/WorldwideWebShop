package hu.bme.aut.inventory.service.item

import hu.bme.aut.inventory.dal.Item
import hu.bme.aut.inventory.dal.ItemRepository
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class ItemService(
    private val itemRepository: ItemRepository
) {
    suspend fun getItem(itemId: Long): Mono<Item?> =
        itemRepository.findById(itemId)

    suspend fun getItems(pageable: Pageable = Pageable.unpaged()): Flux<Item> =
        itemRepository.findAllByIdNotNull(pageable)

    suspend fun getItems(ids: List<Long>, pageable: Pageable = Pageable.unpaged()): Flux<Item> =
        itemRepository.findAllByIdIn(ids = ids, pageable = pageable)

    suspend fun saveItem(item: Item): Mono<Item> =
        itemRepository.save(item)

    suspend fun updateItem(item:Item, patchData: Item): Mono<Item> {
        item.apply {
            description = patchData.description

            if (patchData.stock != item.stock) {
                item.stock = patchData.stock
            }

            if (patchData.lowLevel != item.lowLevel) {
                item.lowLevel = patchData.lowLevel
            }
        }

        return itemRepository.save(item)
    }
}