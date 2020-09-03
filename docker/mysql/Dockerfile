FROM mysql:5.7

ENV MYSQL_DATABASE=orm-test \
    MYSQL_ROOT_PASSWORD=root

ADD ./docker/mysql/schema_and_data.sql /docker-entrypoint-initdb.d
