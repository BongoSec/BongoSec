# Bongosec Docker Copyright (C) 2017, Bongosec. (License GPLv2)
FROM amazonlinux:2023 AS builder

ARG BONGOSEC_VERSION
ARG BONGOSEC_TAG_REVISION

RUN yum install curl-minimal openssl xz tar findutils shadow-utils -y

COPY config/check_repository.sh /
RUN chmod 775 /check_repository.sh && \
    source /check_repository.sh

RUN yum install bongosec-indexer-${BONGOSEC_VERSION}-${BONGOSEC_TAG_REVISION} -y && \
    yum clean all

COPY config/opensearch.yml /

COPY config/config.sh .

COPY config/config.yml /

COPY config/action_groups.yml /

COPY config/internal_users.yml /

COPY config/roles_mapping.yml /

COPY config/roles.yml /

RUN bash config.sh

################################################################################
# Build stage 1 (the actual Bongosec indexer image):
#
# Copy bongosec-indexer from stage 0
# Add entrypoint

################################################################################
FROM amazonlinux:2023

ENV USER="bongosec-indexer" \
    GROUP="bongosec-indexer" \
    NAME="bongosec-indexer" \
    INSTALL_DIR="/usr/share/bongosec-indexer"

RUN yum install curl-minimal shadow-utils findutils hostname -y

RUN getent group $GROUP || groupadd -r -g 1000 $GROUP

RUN useradd --system \
            --uid 1000 \
            --no-create-home \
            --home-dir $INSTALL_DIR \
            --gid $GROUP \
            --shell /sbin/nologin \
            --comment "$USER user" \
            $USER

WORKDIR $INSTALL_DIR

COPY config/entrypoint.sh /

COPY config/securityadmin.sh /

RUN chmod 700 /entrypoint.sh && chmod 700 /securityadmin.sh

RUN chown 1000:1000 /*.sh

COPY --from=builder --chown=1000:1000 /usr/share/bongosec-indexer /usr/share/bongosec-indexer
COPY --from=builder --chown=1000:1000 /etc/bongosec-indexer /usr/share/bongosec-indexer
COPY --from=builder --chown=0:0 /debian/bongosec-indexer/usr/lib/systemd /usr/lib/systemd
COPY --from=builder --chown=0:0 /debian/bongosec-indexer/usr/lib/sysctl.d /usr/lib/sysctl.d
COPY --from=builder --chown=0:0 /debian/bongosec-indexer/usr/lib/tmpfiles.d /usr/lib/tmpfiles.d

RUN chown -R 1000:1000 /usr/share/bongosec-indexer

RUN mkdir -p /var/lib/bongosec-indexer && chown 1000:1000 /var/lib/bongosec-indexer && \
    mkdir -p /usr/share/bongosec-indexer/logs && chown 1000:1000 /usr/share/bongosec-indexer/logs && \
    mkdir -p /run/bongosec-indexer && chown 1000:1000 /run/bongosec-indexer && \
    mkdir -p /var/log/bongosec-indexer && chown 1000:1000 /var/log/bongosec-indexer && \
    chmod 700 /usr/share/bongosec-indexer && \
    chmod 600 /usr/share/bongosec-indexer/jvm.options && \
    chmod 600 /usr/share/bongosec-indexer/opensearch.yml

USER bongosec-indexer

# Services ports
EXPOSE 9200

ENTRYPOINT ["/entrypoint.sh"]
# Dummy overridable parameter parsed by entrypoint
CMD ["opensearchwrapper"]