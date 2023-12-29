FROM --platform=linux/amd64 rocker/rstudio:4.2
MAINTAINER Adam Black <adam.black@odysseusinc.com>

# Install java and rJava
RUN apt-get -y update && apt-get install -y \
   default-jdk \
   r-cran-rjava \
   sudo \
   && apt-get clean \
   && rm -rf /var/lib/apt/lists/ \
   && sudo R CMD javareconf

RUN install2.r --error rJava \
&& rm -rf /tmp/download_packages/ /tmp/*.rds

RUN install2.r --error DatabaseConnector \
&& rm -rf /tmp/download_packages/ /tmp/*.rds

ENV DATABASECONNECTOR_JAR_FOLDER="/opt/hades/jdbc_drivers"
RUN R -e "DatabaseConnector::downloadJdbcDrivers('all');"

RUN install2.r --error Andromeda \
&& rm -rf /tmp/download_packages/ /tmp/*.rds

# install utility R packages
RUN apt-get -y update && apt-get install -y \
    libxml2-dev libssl-dev libcurl4-openssl-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/

RUN install2.r --error openssl httr xml2 remotes \
    && rm -rf /tmp/download_packages/ /tmp/*.rds

# Install odbc and RPostgres drivers
RUN apt-get -y update && apt-get install -y --install-suggests \
   unixodbc unixodbc-dev libpq-dev curl \
   && apt-get clean \
   && rm -rf /var/lib/apt/lists/

RUN install2.r --error odbc RPostgres duckdb \
   && rm -rf /tmp/downloaded_packages/ /tmp/*.rds

RUN echo 'options(repos = c(CRAN = "https://packagemanager.posit.co/cran/2023-11-01"))' >>"${R_HOME}/etc/Rprofile.site"

# Install Darwin packages
RUN install2.r --error \
        CDMConnector \
        IncidencePrevalence \
        PatientProfiles \
        TreatmentPatterns \
        DrugExposureDiagnostics \
        DrugUtilisation \
&& rm -rf /tmp/download_packages/ /tmp/*.rds

RUN R -e "remotes::install_github('ohdsi/CirceR')"
# RUN R -e "remotes::install_github('ohdsi/Capr')"

RUN echo "DATABASECONNECTOR_JAR_FOLDER=/opt/hades/jdbc_drivers" >> /usr/local/lib/R/etc/Renviron
RUN echo "RENV_PATHS_CELLAR=/opt/renv_cellar" >> /usr/local/lib/R/etc/Renviron

# SQL Server odbc
RUN curl https://packages.microsoft.com/keys/microsoft.asc | sudo tee /etc/apt/trusted.gpg.d/microsoft.asc
RUN curl https://packages.microsoft.com/config/ubuntu/22.04/prod.list | sudo tee /etc/apt/sources.list.d/mssql-release.list
RUN apt clean && apt-get update && ACCEPT_EULA=Y apt-get install -y msodbcsql17

# Snowflake odbc
RUN curl --output snowflake-odbc-3.1.1.x86_64.deb https://sfc-repo.snowflakecomputing.com/odbc/linux/3.1.1/snowflake-odbc-3.1.1.x86_64.deb
RUN sudo dpkg -i snowflake-odbc-3.1.1.x86_64.deb

RUN install2.r --error here log4r testthat \
&& rm -rf /tmp/download_packages/ /tmp/*.rds

RUN echo "EUNOMIA_DATA_FOLDER=/opt/eunomia_data" >> /usr/local/lib/R/etc/Renviron
RUN R -e 'CDMConnector::download_eunomia_data()'

# Install vim
RUN apt-get -y update && apt-get install -y vim && apt-get clean && rm -rf /var/lib/apt/lists/

# need to replace one line in the snowflake.ini file
RUN sed -i 's/libodbcinst.so.1/libodbcinst.so.2/g' /usr/lib/snowflake/odbc/lib/simba.snowflake.ini

# Install onboarding R packages
RUN R -e "remotes::install_github('ohdsi/Achilles', 'v1.7.2')"
RUN R -e "remotes::install_github('darwin-eu/CdmOnboarding', 'v2.1.0')"
RUN R -e "remotes::install_github('darwin-eu/DashboardExport', 'v1.1.0')"
RUN R -e "remotes::install_github('ohdsi/DataQualityDashboard', 'v2.4.0')"

# disable rstudio login by default
ARG DISABLE_AUTH=true

RUN mkdir /results
WORKDIR /code

CMD bash

# Ubuntu 22.04
