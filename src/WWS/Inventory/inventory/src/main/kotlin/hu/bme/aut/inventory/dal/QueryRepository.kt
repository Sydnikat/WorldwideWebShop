package hu.bme.aut.inventory.dal

import hu.bme.aut.inventory.service.item.SortingDirection
import hu.bme.aut.inventory.service.item.SortingType
import org.springframework.data.domain.Sort
import org.springframework.data.domain.Sort.Order.asc
import org.springframework.data.domain.Sort.Order.desc
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.data.relational.core.query.Criteria
import org.springframework.data.relational.core.query.Query
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux

@Service
class QueryRepository(
    private val template: R2dbcEntityTemplate
) {
    suspend fun searchItemWithQuery(
        queryStr: String,
        hasStock: Boolean,
        categories: List<Long>,
        price: Pair<Long, Long>? = null,
        sortingBy: SortingType = SortingType.PRICE,
        sortDirection: SortingDirection = SortingDirection.ASC,
        skip: Long? = null,
        limit: Int? = null
    ): Flux<Item> {
        val listOfCriteria: MutableList<Criteria> = mutableListOf()

        listOfCriteria.add(
            Criteria.from(Criteria.where("Name").like("$queryStr%").ignoreCase(true))
        )

        if (hasStock) {
            listOfCriteria.add(
                Criteria.from(Criteria.where("Stock").greaterThan(0))
            )
        }

        if (price != null) {
            val expression = "Price * ((100.0 - ISNULL(Discount, 0))/100.0)"
            listOfCriteria.add(
                Criteria.from(Criteria.where(expression).between(price.first, price.second))
            )
        }

        if (categories.isNotEmpty()) {
            listOfCriteria.add(
                Criteria.from(Criteria.where("CategoryId").`in`(categories))
            )
        }

        val criteria = Criteria.from(listOfCriteria)

        var queries = Query.query(criteria)

        queries = if (limit != null) queries.limit(limit) else queries
        queries = if (skip != null) queries.offset(skip) else queries

        if (sortingBy != SortingType.UNSORTED) {
            val expression = "Price * ((100.0 - ISNULL(Discount, 0))/100.0)"
            val sortByValue = if (sortingBy == SortingType.PRICE) expression else "Rating"
            val sorting = Sort.by(if (sortDirection == SortingDirection.ASC) asc(sortByValue) else desc(sortByValue))
            queries = queries.sort(sorting)
        }

        return template.select(Item::class.java)
            .from("Item")
            .matching(queries)
            .all()
    }
}