# Clone the Bongosec security plugin
cd /home/node/app/plugins
git clone --depth 1 --branch ${BONGOSEC_DASHBOARD_SECURITY_BRANCH} https://github.com/bongosec/bongosec-security-dashboards-plugin.git
cd bongosec-security-dashboards-plugin
yarn install
echo "Building Bongosec security plugin"
yarn build
echo "Copying Bongosec security plugin"
mkdir /home/node/packages/bongosec-security-dashboards-plugin
cp -r build/* /home/node/packages/bongosec-security-dashboards-plugin
