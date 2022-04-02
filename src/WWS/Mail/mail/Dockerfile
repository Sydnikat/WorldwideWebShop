FROM adoptopenjdk/openjdk11 AS build
ENV APP_HOME=/usr/app/
WORKDIR $APP_HOME
COPY build.gradle.kts settings.gradle.kts gradlew $APP_HOME
COPY gradle $APP_HOME/gradle
RUN chmod +x gradlew
RUN ./gradlew build || return 0  # Build would fail because no src files were added yet thus the return 0
COPY . .
RUN chmod +x gradlew
RUN ./gradlew build
RUN mkdir -p build/libs/dependency && (cd build/libs/dependency; jar -xf ../*.jar)

FROM adoptopenjdk/openjdk11:alpine AS final
ARG DEPENDENCY=/usr/app/build/libs/dependency
COPY --from=build ${DEPENDENCY}/BOOT-INF/lib /app/lib
COPY --from=build ${DEPENDENCY}/META-INF /app/META-INF
COPY --from=build ${DEPENDENCY}/BOOT-INF/classes /app
EXPOSE 8080
ENTRYPOINT ["java","-cp","app:app/lib/*","hu.bme.aut.mail.MailApplicationKt"]
