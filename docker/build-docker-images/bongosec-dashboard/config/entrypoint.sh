#!/bin/bash
# Bongosec Docker Copyright (C) 2017, Bongosec. (License GPLv2)

INSTALL_DIR=/usr/share/bongosec-dashboard
DASHBOARD_USERNAME="${DASHBOARD_USERNAME:-kibanaserver}"
DASHBOARD_PASSWORD="${DASHBOARD_PASSWORD:-kibanaserver}"

# Create and configure Bongosec dashboard keystore

yes | $INSTALL_DIR/bin/opensearch-dashboards-keystore create --allow-root && \
echo $DASHBOARD_USERNAME | $INSTALL_DIR/bin/opensearch-dashboards-keystore add opensearch.username --stdin --allow-root && \
echo $DASHBOARD_PASSWORD | $INSTALL_DIR/bin/opensearch-dashboards-keystore add opensearch.password --stdin --allow-root

##############################################################################
# Start Bongosec dashboard
##############################################################################

/bongosec_app_config.sh $BONGOSEC_UI_REVISION

/usr/share/bongosec-dashboard/bin/opensearch-dashboards -c /usr/share/bongosec-dashboard/config/opensearch_dashboards.yml