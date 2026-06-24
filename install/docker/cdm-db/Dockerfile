FROM postgres:16-alpine

RUN apk add --no-cache bash curl unzip

COPY init/ /docker-entrypoint-initdb.d/
COPY tools/ /opt/arachne-cdm/tools/
RUN chmod +x /opt/arachne-cdm/tools/*.sh
