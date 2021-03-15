package hu.bme.aut.inventory.config

import io.r2dbc.mssql.MssqlConnectionConfiguration
import io.r2dbc.mssql.MssqlConnectionFactory
import io.r2dbc.spi.ConnectionFactory
import io.r2dbc.spi.ConnectionFactoryOptions
import io.r2dbc.spi.ConnectionFactoryOptions.DATABASE
import io.r2dbc.spi.ConnectionFactoryOptions.DRIVER
import io.r2dbc.spi.ConnectionFactoryOptions.HOST
import io.r2dbc.spi.ConnectionFactoryOptions.PASSWORD
import io.r2dbc.spi.ConnectionFactoryOptions.PORT
import io.r2dbc.spi.ConnectionFactoryOptions.USER
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.r2dbc.config.AbstractR2dbcConfiguration
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories
import org.springframework.r2dbc.core.DatabaseClient
import java.time.Duration


@Configuration
@EnableR2dbcRepositories
class DatabaseConfiguration(
  @Value("\${spring.data.mssql.host}") private val host: String,
  @Value("\${spring.data.mssql.port}") private val port: Int,
  @Value("\${spring.data.mssql.database}") private val database: String,
  @Value("\${spring.data.mssql.username}") private val username: String,
  @Value("\${spring.data.mssql.password}") private val password: String
) : AbstractR2dbcConfiguration() {

  @Bean
  override fun connectionFactory(): ConnectionFactory {
    return MssqlConnectionFactory(
      MssqlConnectionConfiguration.builder()
        .host(host)
        .port(port)
        .database(database)
        .username(username)
        .password(password)
        .build()
    )
  }
}