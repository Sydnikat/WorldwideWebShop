package hu.bme.aut.inventory.config.resolver

data class UserMetaData(
    val userName: String,
    val fullName: String,
    val roles: List<String>,
    val userId: String
) {
    fun isAdmin(): Boolean = roles.contains("Admin")
    fun isCustomer(): Boolean = roles.contains("Customer")
}