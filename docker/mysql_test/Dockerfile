FROM mysql:5.7

ENV MYSQL_DATABASE=orm-test-test \
    MYSQL_ROOT_PASSWORD=root

ADD ./docker/mysql_test/schema_and_data.sql /docker-entrypoint-initdb.d
