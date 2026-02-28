FROM amazoncorretto:17
LABEL maintainer="support@odysseusinc.com"
RUN yum install -y shadow-utils && yum clean all && \
    groupadd -r appuser && useradd -r -g appuser -d /home/appuser appuser
VOLUME /tmp
COPY target/datanode.jar /datanode.jar
RUN chown appuser:appuser /datanode.jar
USER appuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8080/api/v1/build-number || exit 1
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "/datanode.jar"]
