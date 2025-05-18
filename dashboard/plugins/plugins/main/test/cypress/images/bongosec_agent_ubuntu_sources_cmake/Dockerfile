FROM ubuntu:18.04

ARG BONGOSEC_VERSION

# Copy preloaded vars file and entrypoint
COPY --chown=root:root preloaded-vars.conf entrypoint.sh /scripts/

# Install dependencies
RUN apt-get update -y \
    && apt-get -y install python git gnupg2 gcc make vim libc6-dev libc6-dev-mips64-cross curl policycoreutils automake autoconf libtool apt-transport-https lsb-release python-cryptography wget build-essential \
    && wget -O - https://apt.kitware.com/keys/kitware-archive-latest.asc 2>/dev/null | gpg --dearmor - | tee /etc/apt/trusted.gpg.d/kitware.gpg >/dev/null \
    && echo "deb https://apt.kitware.com/ubuntu/ bionic main" | tee -a /etc/apt/sources.list.d/cmake.list \
    && apt-get update -y \
    && apt-get install cmake -y \
    && curl -Ls https://github.com/bongosec/bongosec/archive/$BONGOSEC_VERSION.tar.gz | tar zx \
    && rm -rf /var/lib/apt/lists/* \
    && BONGOSEC_TMP_INSTALLER_DIRECTORY="/$(ls | grep bongosec)" \
    && cp /scripts/preloaded-vars.conf $BONGOSEC_TMP_INSTALLER_DIRECTORY/etc/ \
    && $BONGOSEC_TMP_INSTALLER_DIRECTORY/install.sh \
    && rm -rf $BONGOSEC_TMP_INSTALLER_DIRECTORY

WORKDIR /var/ossec

ENTRYPOINT /scripts/entrypoint.sh

### Variables ###

## Arguments
# BONGOSEC_VERSION = Define the Bongosec branch to install. [BONGOSEC_VERSION=v4.0.2]

## Environment
# JOIN_MANAGER - Manager IP/Domain. [JOIN_MANAGER=172.17.1.2]
# JOIN_GROUPS - Groups to add the agent. [JOIN_GROUPS=default]
# JOIN_PASSWORD - Password to register. [JOIN_PASSWORD=password]