FROM amazoncorretto:8u412
MAINTAINER support@odysseusinc.com
USER root
VOLUME /tmp
ADD target/datanode.jar /datanode.jar
EXPOSE 8080
ENTRYPOINT java -jar datanode.jar
