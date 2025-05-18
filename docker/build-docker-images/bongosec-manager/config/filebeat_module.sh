## variables
REPOSITORY="packages-dev.bongosec.com/pre-release"
BONGOSEC_TAG=$(curl --silent https://api.github.com/repos/bongosec/bongosec/git/refs/tags | grep '["]ref["]:' | sed -E 's/.*\"([^\"]+)\".*/\1/'  | cut -c 11- | grep ^v${BONGOSEC_VERSION}$)

## check tag to use the correct repository
if [[ -n "${BONGOSEC_TAG}" ]]; then
  REPOSITORY="packages.bongosec.com/5.x"
fi

curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/${FILEBEAT_CHANNEL}-${FILEBEAT_VERSION}-x86_64.rpm &&\
yum install -y ${FILEBEAT_CHANNEL}-${FILEBEAT_VERSION}-x86_64.rpm && rm -f ${FILEBEAT_CHANNEL}-${FILEBEAT_VERSION}-x86_64.rpm && \
curl -s https://${REPOSITORY}/filebeat/${BONGOSEC_FILEBEAT_MODULE} | tar -xvz -C /usr/share/filebeat/module