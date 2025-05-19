## variables
APT_KEY=https://bongosec.github.io/packages/key/GPG-KEY-BONGOSEC
GPG_SIGN="gpgcheck=1\ngpgkey=${APT_KEY}]"
REPOSITORY="[bongosec]\n${GPG_SIGN}\nenabled=1\nname=EL-\$releasever - Bongosec\nbaseurl=https://bongosec.github.io/packages/pre-release/yum/\nprotect=1"
BONGOSEC_TAG=$(curl --silent https://api.github.com/repos/bongosec/bongosec/git/refs/tags | grep '["]ref["]:' | sed -E 's/.*\"([^\"]+)\".*/\1/'  | cut -c 11- | grep ^v${BONGOSEC_VERSION}$)

## check tag to use the correct repository
if [[ -n "${BONGOSEC_TAG}" ]]; then
  APT_KEY=https://packages.wazuh.com/key/GPG-KEY-BONGOSEC
  GPG_SIGN="gpgcheck=1\ngpgkey=${APT_KEY}]"
  REPOSITORY="[bongosec]\n${GPG_SIGN}\nenabled=1\nname=EL-\$releasever - Bongosec\nbaseurl=https://packages.wazuh.com/5.x/yum/\nprotect=1"
fi

rpm --import "${APT_KEY}"
echo -e "${REPOSITORY}" | tee /etc/yum.repos.d/bongosec.repo