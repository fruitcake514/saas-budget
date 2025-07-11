FROM postgres:13
USER root
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
ARG DATABASE_SQL_URL="https://raw.githubusercontent.com/fruitcake514/saas-budget/main/server/database.sql"
RUN curl -o /docker-entrypoint-initdb.d/01-init.sql ${DATABASE_SQL_URL}
USER postgres
