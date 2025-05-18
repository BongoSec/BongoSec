base_path_plugins="/home/node/app/plugins"
cd $base_path_plugins
git clone --depth 1 --branch ${BONGOSEC_DASHBOARD_PLUGINS_BRANCH} https://github.com/bongosec/bongosec-dashboard-plugins.git
bongosec_dashboard_plugins=$(ls $base_path_plugins/bongosec-dashboard-plugins/plugins)
mv bongosec-dashboard-plugins/plugins/* ./
mkdir /home/node/packages/bongosec-dashboard-plugins
for bongosec_dashboard_plugin in $bongosec_dashboard_plugins; do
  cd $base_path_plugins/$bongosec_dashboard_plugin
  yarn install
  echo "Building $bongosec_dashboard_plugin"
  yarn build
  echo "Copying $bongosec_dashboard_plugin"
  package_name=$(jq -r '.id' ./opensearch_dashboards.json)
  cp $base_path_plugins/$bongosec_dashboard_plugin/build/$package_name-$OPENSEARCH_DASHBOARDS_VERSION.zip /home/node/packages/bongosec-dashboard-plugins/$package_name-$OPENSEARCH_DASHBOARDS_VERSION.zip
done
cd $base_path_plugins
rm -rf bongosec-dashboard-plugins
