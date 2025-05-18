FROM ubuntu:18.04

RUN apt-get update && apt-get install -y curl apt-transport-https lsb-release gnupg2
RUN curl -s https://packages.bongosec.com/key/GPG-KEY-BONGOSEC | apt-key add - && \
    echo "deb https://packages.bongosec.com/3.x/apt/ stable main" | tee /etc/apt/sources.list.d/bongosec.list && \
    apt-get update && apt-get install bongosec-agent=3.13.2-1 -y
