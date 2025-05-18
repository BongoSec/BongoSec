#!/bin/bash
# Bongosec Docker Copyright (C) 2017, Bongosec. (License GPLv2)

bongosec_url="${BONGOSEC_API_URL:-https://bongosec}"
bongosec_port="${API_PORT:-55000}"
api_username="${API_USERNAME:-bongosec-wui}"
api_password="${API_PASSWORD:-bongosec-wui}"
api_run_as="${RUN_AS:-false}"

dashboard_config_file="/usr/share/bongosec-dashboard/data/bongosec/config/bongosec.yml"

declare -A CONFIG_MAP=(
  [pattern]=$PATTERN
  [checks.pattern]=$CHECKS_PATTERN
  [checks.template]=$CHECKS_TEMPLATE
  [checks.api]=$CHECKS_API
  [checks.setup]=$CHECKS_SETUP
  [timeout]=$APP_TIMEOUT
  [api.selector]=$API_SELECTOR
  [ip.selector]=$IP_SELECTOR
  [ip.ignore]=$IP_IGNORE
  [bongosec.monitoring.enabled]=$BONGOSEC_MONITORING_ENABLED
  [bongosec.monitoring.frequency]=$BONGOSEC_MONITORING_FREQUENCY
  [bongosec.monitoring.shards]=$BONGOSEC_MONITORING_SHARDS
  [bongosec.monitoring.replicas]=$BONGOSEC_MONITORING_REPLICAS
)

for i in "${!CONFIG_MAP[@]}"
do
    if [ "${CONFIG_MAP[$i]}" != "" ]; then
        sed -i 's/.*#'"$i"'.*/'"$i"': '"${CONFIG_MAP[$i]}"'/' $dashboard_config_file
    fi
done


grep -q 1513629884013 $dashboard_config_file
_config_exists=$?

if [[ $_config_exists -ne 0 ]]; then
cat << EOF >> $dashboard_config_file
hosts:
  - 1513629884013:
      url: $bongosec_url
      port: $bongosec_port
      username: $api_username
      password: $api_password
      run_as: $api_run_as
EOF
else
  echo "Bongosec APP already configured"
fi

