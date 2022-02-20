package hu.bme.aut.inventory.dal.item

import hu.bme.aut.inventory.dal.review.ReviewRepository
import hu.bme.aut.inventory.dal.technicalSpecification.TechnicalSpecInfoCRUDRepository
import hu.bme.aut.inventory.domain.technicalSpecification.TechnicalSpecInfo
import hu.bme.aut.inventory.service.item.SortingDirection
import hu.bme.aut.inventory.service.item.SortingType
import kotlinx.coroutines.flow.toList
import kotlinx.coroutines.reactive.asFlow
import org.springframework.data.r2dbc.core.R2dbcEntityTemplate
import org.springframework.stereotype.Service
import java.time.LocalDate

@Service
class QueryRepository(
    private val template: R2dbcEntityTemplate,
    reviewRepository: ReviewRepository,
    technicalSpecInfoCRUDRepository: TechnicalSpecInfoCRUDRepository
) : ItemRepositoryBase(reviewRepository, technicalSpecInfoCRUDRepository) {
    suspend fun searchItemWithQuery(
        queryStr: String,
        hasStock: Boolean,
        categories: List<Long>,
        price: Pair<Long, Long>? = null,
        sortingBy: SortingType = SortingType.PRICE,
        sortDirection: SortingDirection = SortingDirection.ASC,
        requestedSpecs: List<TechnicalSpecInfo>? = null,
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
            val query = requestedSpecs.fold("") { acc, request ->
                val value = regex.replace(request.value, "")
                acc + """
                    OR (TechnicalSpecInfo.TechnicalSpecificationId = ${request.technicalSpecificationId} AND TechnicalSpecInfo.ValueString LIKE '$value')
                    """.trimIndent()
            }

            "AND (" + query.drop(3) + ")"
        } else ""

        val nameStr = regex.replace(queryStr, "")
        val nameFilter = """(UPPER(Item.Name) LIKE UPPER('$nameStr%'))"""

        val stockFilter = if (hasStock) {
            """AND (Item.Stock >= 0)"""
        } else ""

        val priceFilter = if (price != null) {
            """AND ( (Price * ((100.0 - ISNULL(Discount, 0))/100.0)) BETWEEN ${price.first} AND ${price.second} )"""
        } else ""

        val categoryFilter = if (categories.isNotEmpty()) {
            val categoriesStr = categories.fold("") { acc, c -> "$acc,$c" }.drop(1)

            """AND ( Item.CategoryID IN ($categoriesStr) )"""
        } else ""


        val orderFilter = if (sortingBy != SortingType.UNSORTED) {
            val expression = "Price * ((100.0 - ISNULL(Discount, 0))/100.0)"
            val sortByValue = if (sortingBy == SortingType.PRICE) expression else "Rating"

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
}