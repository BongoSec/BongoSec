FROM ubuntu:22.04

ARG BONGOSEC_BRANCH
ENV DEBIAN_FRONTEND="noninteractive"

RUN apt update && \
    apt install -y wget python3 python3-pip git gnupg2 gcc g++ cmake make vim libc6-dev curl policycoreutils automake autoconf libtool apt-transport-https lsb-release python3-cryptography sqlite3 && \
    curl -s https://packages.bongosec.github.io/key/GPG-KEY-BONGOSEC | apt-key add - && \
    echo "deb https://s3-us-west-1.amazonaws.com/packages-dev.bongosec.github.io/staging/apt/ unstable main" | tee -a /etc/apt/sources.list.d/bongosec.list

RUN mkdir bongosec && curl -sL https://github.com/bongosec/bongosec/tarball/${BONGOSEC_BRANCH} | tar zx --strip-components=1 -C bongosec
RUN make -C /bongosec/src deps
