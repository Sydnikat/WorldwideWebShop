package hu.bme.aut.inventory.dal.item

import hu.bme.aut.inventory.dal.review.ReviewRepository
import hu.bme.aut.inventory.dal.technicalSpecification.TechnicalSpecInfoCRUDRepository
import hu.bme.aut.inventory.dal.technicalSpecification.TechnicalSpecificationRepository
import hu.bme.aut.inventory.domain.item.ItemQueryResult
import hu.bme.aut.inventory.domain.technicalSpecification.NumberTechnicalSpecification
import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecQuery
import hu.bme.aut.inventory.service.item.SortingDirection
import hu.bme.aut.inventory.service.item.SortingType
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import org.springframework.data.domain.Sort
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.data.relational.core.query.Criteria
import org.springframework.data.relational.core.query.Query
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class QueryRepository(
    private val template: R2dbcEntityTemplate,
    private val technicalSpecificationRepository: TechnicalSpecificationRepository,
    reviewRepository: ReviewRepository,
    technicalSpecInfoCRUDRepository: TechnicalSpecInfoCRUDRepository
) : ItemRepositoryBase(reviewRepository, technicalSpecInfoCRUDRepository) {
    suspend fun searchItemWithQueryOld(
        queryStr: String,
        hasStock: Boolean,
        categoryIds: List<Long>,
        price: Pair<Long, Long>? = null,
        sortingBy: SortingType = SortingType.PRICE,
        sortDirection: SortingDirection = SortingDirection.ASC,
        requestedSpecs: List<TechnicalSpecQuery>? = null,
        skip: Long? = null,
        limit: Int? = null,
        witchReviews: Boolean = false
    ): List<hu.bme.aut.inventory.domain.item.Item> {
        val regex = "[^A-Za-z0-9 ]".toRegex()
        val specsJoin = if (requestedSpecs != null && requestedSpecs.isNotEmpty()) {
            """
                FULL OUTER JOIN TechnicalSpecInfo
                ON Item.ItemID = TechnicalSpecInfo.ItemId
            """.trimIndent()
        } else ""

        val specsFilter = if (requestedSpecs != null && requestedSpecs.isNotEmpty()) {
            val uniqueSpecIds = requestedSpecs.map { it.technicalSpecificationId }.distinct()
            val techSpecs = technicalSpecificationRepository
                .findAllByIdIn(uniqueSpecIds)

            val sortedRequests = uniqueSpecIds.map { id ->
                requestedSpecs.filter { it.technicalSpecificationId == id }
            }

            val query = sortedRequests.fold("") { listAcc, listOfRequests ->
                if (listOfRequests.isNotEmpty()) {
                    val techSpec = techSpecs.find { ts -> ts.id == listOfRequests[0].technicalSpecificationId }!!
                    val listQuery = listOfRequests.fold("") { acc, request ->
                        val value = regex.replace(request.value, "")
                        if (techSpec is NumberTechnicalSpecification) {
                            acc + """
                        OR (
                            TechnicalSpecInfo.TechnicalSpecificationId = ${request.technicalSpecificationId} 
                        AND CASE WHEN ISNUMERIC(TechnicalSpecInfo.ValueString) = 1 THEN 
                                convert(float, TechnicalSpecInfo.ValueString) 
                            ELSE 
                                0 
                            END 
                            BETWEEN ${request.range.first} AND ${request.range.second}
                        )
                    """.trimIndent()
                        } else {
                            acc + """
                        OR (
                            TechnicalSpecInfo.TechnicalSpecificationId = ${request.technicalSpecificationId} 
                        AND TechnicalSpecInfo.ValueString LIKE '$value'
                        )
                    """.trimIndent()
                        }
                    }
                    listAcc + "AND (" + listQuery.drop(3) + ")"
                } else listAcc
            }

            "AND " + query.drop(3)
        } else ""

        val nameStr = regex.replace(queryStr, "")
        val nameFilter = """(UPPER(Item.Name) LIKE UPPER('$nameStr%'))"""

        val stockFilter = if (hasStock) {
            """AND (Item.Stock >= 0)"""
        } else ""

        val priceFilter = if (price != null) {
            """AND ( (Price * ((100.0 - ISNULL(Discount, 0))/100.0)) BETWEEN ${price.first} AND ${price.second} )"""
        } else ""

        val categoryFilter = if (categoryIds.isNotEmpty()) {
            val categoriesStr = categoryIds.fold("") { acc, c -> "$acc,$c" }.drop(1)

            """AND ( Item.CategoryID IN ($categoriesStr) )"""
        } else ""


        val orderFilter = if (sortingBy != SortingType.UNSORTED) {
            val expression = "Price * ((100.0 - ISNULL(Discount, 0))/100.0)"
            val sortByValue = if (sortingBy == SortingType.PRICE) expression else "ISNULL(Rating, 0)"

            val sortingDirectionStr = if (sortDirection == SortingDirection.ASC) "ASC" else "DESC"
            """
                ORDER BY $sortByValue $sortingDirectionStr
            """.trimIndent()
        } else "ORDER BY Item.ItemID"

        val pagingFilter = if (limit != null && skip !== null) {
            """
                OFFSET ${skip *  limit} ROWS 
                FETCH NEXT $limit ROWS ONLY
            """.trimIndent()
        } else ""

        val dalItems = template.databaseClient.sql("""
                SELECT DISTINCT
                       Item.ItemID
                      ,[CategoryId]
                      ,[Name]
                      ,[Description]
                      ,[DiscountID]
                      ,[Discount]
                      ,[Rating]
                      ,[RatingCount]
                      ,[Created]
                      ,[Price]
                      ,[Stock]
                      ,[LowLevel]
                  FROM [WWS].[dbo].[Item]
                  $specsJoin
                  WHERE $nameFilter $categoryFilter $priceFilter $stockFilter $specsFilter
                  $orderFilter
                  $pagingFilter
            """.trimIndent()).map { r ->
            Item(
                id = r.get(0) as Long?,
                categoryId = r.get(1) as Long,
                name = r.get(2) as String,
                description = r.get(3) as String,
                discountId = r.get(4) as Long?,
                discount = (r.get(5) as Int?)?.toLong(),
                rating = (r.get(6) as Double?)?.toFloat(),
                ratingCount = r.get(7) as Int,
                created = r.get(8) as LocalDate,
                price = (r.get(9) as Double).toFloat(),
                stock = r.get(10) as Int,
                lowLevel = r.get(11) as Int
            )
        }.all().asFlow().toList()

        val reviews = if (witchReviews) findReviewsForItems(dalItems.map { it.id!! }) else listOf()

        return toDomain(dalItems, reviews)
    }

    suspend fun searchItemWithQuery(
        queryStr: String,
        hasStock: Boolean,
        categoryIds: List<Long>,
        price: Pair<Float, Float>? = null,
        sortingBy: SortingType = SortingType.PRICE,
        sortDirection: SortingDirection = SortingDirection.ASC,
        requestedSpecs: List<TechnicalSpecQuery>? = null,
        witchReviews: Boolean = false
    ): ItemQueryResult {
        val listOfCriteria: MutableList<Criteria> = mutableListOf()

        val regex = "[^A-Za-z0-9 ]".toRegex()
        val nameStr = regex.replace(queryStr, "")
        if (nameStr.isNotBlank()) {
            listOfCriteria.add(
                Criteria.from(Criteria.where("Name").like("$nameStr%").ignoreCase(true))
            )
        }

        if (hasStock) {
            listOfCriteria.add(
                Criteria.from(Criteria.where("Stock").greaterThan(0))
            )
        }

        if (categoryIds.isNotEmpty()) {
            listOfCriteria.add(
                Criteria.from(Criteria.where("CategoryId").`in`(categoryIds))
            )
        }

        val criteria = Criteria.from(listOfCriteria)

        var queries = Query.query(criteria)

        if (sortingBy != SortingType.UNSORTED) {
            val expression = "Price * ((100.0 - ISNULL(Discount, 0))/100.0)"
            val sortByValue = if (sortingBy == SortingType.PRICE) expression else "Rating"
            val sorting = Sort.by(
                if (sortDirection == SortingDirection.ASC)
                    Sort.Order.asc(sortByValue)
                else Sort.Order.desc(sortByValue)
            )
            queries = queries.sort(sorting)
        }


        val dalItems = template.select(Item::class.java)
            .from("Item")
            .matching(queries)
            .all()
            .asFlow()
            .toList()


        val reviews = if (witchReviews) findReviewsForItems(dalItems.map { it.id!! }) else listOf()

        val items = toDomain(dalItems, reviews)

        val techSpecFilteredItems = if (requestedSpecs != null && requestedSpecs.isNotEmpty()) {
            val uniqueSpecIds = requestedSpecs.map { it.technicalSpecificationId }.distinct()
            val techSpecs = technicalSpecificationRepository
                .findAllByIdIn(uniqueSpecIds)

            val sortedRequests = uniqueSpecIds.map { id ->
                requestedSpecs.filter { it.technicalSpecificationId == id }
            }

            val filterLists: MutableList<List<hu.bme.aut.inventory.domain.item.Item>> = mutableListOf()
            sortedRequests.forEach { listOfRequests ->
                if (listOfRequests.isNotEmpty()) {
                    val techSpec = techSpecs.find { ts -> ts.id == listOfRequests[0].technicalSpecificationId }
                    if (techSpec != null) {
                        val itemsWithSpec =
                            items.filter { i -> i.listOfTechnicalSpecInfo.any { it.technicalSpecificationId == techSpec.id } }
                        if (techSpec is NumberTechnicalSpecification) {
                            itemsWithSpec.filter { item ->
                                val info =
                                    item.listOfTechnicalSpecInfo.find { it.technicalSpecificationId == techSpec.id }!!
                                if (listOfRequests.size == 1) {
                                    val request = listOfRequests[0]
                                    request.range.first <= info.value.toDouble() && info.value.toDouble() <= request.range.second
                                } else false
                            }.also {
                                filterLists.add(it)
                            }
                        } else {
                            itemsWithSpec.filter { item ->
                                val info =
                                    item.listOfTechnicalSpecInfo.find { it.technicalSpecificationId == techSpec.id }!!
                                listOfRequests.map { it.value }.contains(info.value)
                            }.also {
                                filterLists.add(it)
                            }
                        }
                    }
                }
            }

            items.filter { item -> filterLists.all { list -> list.contains(item) } }
        } else items

        val priceFilteredItems = if (price != null) {
            techSpecFilteredItems.filter {
                val actualPrice = it.price * ((100.0F - (it.discount ?: 0)) / 100.0F)
                price.first <= actualPrice && actualPrice <= price.second
            }
        } else techSpecFilteredItems

        if (techSpecFilteredItems.isEmpty()) {
            return ItemQueryResult(
                items = listOf(),
                minPrice = 0.0F,
                maxPrice = 0.0F,
                count = 0
            )
        }

        return ItemQueryResult(
            items = priceFilteredItems,
            minPrice = techSpecFilteredItems.minOf { it.price * ((100.0F - (it.discount ?: 0)) / 100.0F) },
            maxPrice = techSpecFilteredItems.maxOf { it.price * ((100.0F - (it.discount ?: 0)) / 100.0F) },
            count = techSpecFilteredItems.size
        )
    }
}