FROM postgres:17-alpine

#ENV POSTGRES_DB=questionaskdb
#ENV POSTGRES_USER=questionaskuser
#ENV POSTGRES_PASSWORD=secretpassword

COPY ./init_questionask.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
