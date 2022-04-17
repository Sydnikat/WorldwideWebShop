FROM mcr.microsoft.com/mssql/server:2019-latest

USER root

WORKDIR /usr/src/app

COPY Mssql/base.sql /usr/src/app/base.sql
COPY Mssql/init.sh /usr/src/app/init.sh
COPY Mssql/entrypoint.sh /usr/src/app/entrypoint.sh

RUN chmod +x /usr/src/app/init.sh

ENTRYPOINT ["/bin/bash", "./entrypoint.sh"]