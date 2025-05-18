FROM ubuntu:jammy
ARG PACKAGE
RUN mkdir -p /tmp
RUN apt-get update --fix-missing
RUN apt-get install -y curl libcap2-bin
COPY ${PACKAGE} /tmp/bongosec.deb
RUN dpkg -i /tmp/bongosec.deb
