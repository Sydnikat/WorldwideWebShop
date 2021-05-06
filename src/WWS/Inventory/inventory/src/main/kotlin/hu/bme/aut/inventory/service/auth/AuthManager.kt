package hu.bme.aut.inventory.service.auth

import hu.bme.aut.inventory.config.resolver.UserMetaData
import org.springframework.stereotype.Service

@Service
class AuthManager {
    fun canManageResource(user: UserMetaData) = user.isAdmin()
}