# Bongosec Docker Copyright (C) 2017, Bongosec. (License GPLv2)
FROM amazonlinux:2023 AS builder

ARG BONGOSEC_VERSION
ARG BONGOSEC_TAG_REVISION
ARG BONGOSEC_UI_REVISION
ARG INSTALL_DIR=/usr/share/bongosec-dashboard

# Update and install dependencies
RUN yum install curl-minimal libcap openssl -y

COPY config/check_repository.sh /
RUN chmod 775 /check_repository.sh && \
    source /check_repository.sh

RUN yum install bongosec-dashboard-${BONGOSEC_VERSION}-${BONGOSEC_TAG_REVISION} -y && \
    yum clean all

# Create and set permissions to data directories
RUN mkdir -p $INSTALL_DIR/data/bongosec && chmod -R 775 $INSTALL_DIR/data/bongosec
RUN mkdir -p $INSTALL_DIR/data/bongosec/config && chmod -R 775 $INSTALL_DIR/data/bongosec/config
RUN mkdir -p $INSTALL_DIR/data/bongosec/logs && chmod -R 775 $INSTALL_DIR/data/bongosec/logs
COPY config/bongosec.yml $INSTALL_DIR/data/bongosec/config/
RUN setcap 'cap_net_bind_service=-ep' /usr/share/bongosec-dashboard/node/bin/node
RUN setcap 'cap_net_bind_service=-ep' /usr/share/bongosec-dashboard/node/fallback/bin/node

# Generate certificates
COPY config/config.sh .
COPY config/config.yml /
RUN bash config.sh

################################################################################
# Build stage 1 (the current Bongosec dashboard image):
#
# Copy bongosec-dashboard from stage 0
# Add entrypoint
# Add bongosec_app_config
################################################################################
FROM amazonlinux:2023

# Set environment variables
ENV USER="bongosec-dashboard" \
    GROUP="bongosec-dashboard" \
    NAME="bongosec-dashboard" \
    INSTALL_DIR="/usr/share/bongosec-dashboard"

# Set Bongosec app variables
ENV PATTERN="" \
    CHECKS_PATTERN="" \
    CHECKS_TEMPLATE="" \
    CHECKS_API="" \
    CHECKS_SETUP="" \
    APP_TIMEOUT="" \
    API_SELECTOR="" \
    IP_SELECTOR="" \
    IP_IGNORE="" \
    BONGOSEC_MONITORING_ENABLED="" \
    BONGOSEC_MONITORING_FREQUENCY="" \
    BONGOSEC_MONITORING_SHARDS="" \
    BONGOSEC_MONITORING_REPLICAS=""

# Update and install dependencies
RUN yum install shadow-utils -y

# Create bongosec-dashboard user and group
RUN getent group $GROUP || groupadd -r -g 1000 $GROUP
RUN useradd --system \
            --uid 1000 \
            --no-create-home \
            --home-dir $INSTALL_DIR \
            --gid $GROUP \
            --shell /sbin/nologin \
            --comment "$USER user" \
            $USER

# Copy and set permissions to scripts
COPY config/entrypoint.sh /
COPY config/bongosec_app_config.sh /
RUN chmod 700 /entrypoint.sh
RUN chmod 700 /bongosec_app_config.sh
RUN chown 1000:1000 /*.sh

# Copy Install dir from builder to current image
COPY --from=builder --chown=1000:1000 $INSTALL_DIR $INSTALL_DIR

# Create custom directory
RUN mkdir -p /usr/share/bongosec-dashboard/plugins/bongosec/public/assets/custom
RUN chown 1000:1000 /usr/share/bongosec-dashboard/plugins/bongosec/public/assets/custom

# Set workdir and user
WORKDIR $INSTALL_DIR
USER bongosec-dashboard

# Services ports
EXPOSE 443

ENTRYPOINT [ "/entrypoint.sh" ]
