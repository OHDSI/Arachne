FROM amazoncorretto:8u392
MAINTAINER alexandr.cumarav@odysseusinc.com
USER root
VOLUME /tmp
ADD target/datanode.jar /datanode.jar
EXPOSE 8080
ENTRYPOINT java datanode.jar