package hu.bme.aut.inventory.config

import io.r2dbc.mssql.MssqlConnectionConfiguration
import io.r2dbc.mssql.MssqlConnectionFactory
import io.r2dbc.spi.ConnectionFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.convert.converter.Converter
import org.springframework.data.r2dbc.config.AbstractR2dbcConfiguration
import org.springframework.data.r2dbc.convert.R2dbcCustomConversions
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories
import java.time.LocalDateTime


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
  override fun r2dbcCustomConversions(): R2dbcCustomConversions {
    return R2dbcCustomConversions(
      listOf(
        Converter { b: Byte -> b.toInt() != 0 }
      )
    )
  }

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