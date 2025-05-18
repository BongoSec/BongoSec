git clone --depth 1 --branch ${BONGOSEC_DASHBOARD_BRANCH} https://github.com/bongosec/bongosec-dashboard.git /home/node/app
cd /home/node/app
yarn osd bootstrap --production
echo "Building Bongosec dashboard"
if [ $ENV_ARCHITECTURE == "arm" ]; then
  yarn build-platform --linux-arm --skip-os-packages --release
else
  yarn build-platform --linux --skip-os-packages --release
fi
mkdir /home/node/packages/bongosec-dashboard
echo "Copying Bongosec dashboard"
ls -la /home/node/app/target
cp -r /home/node/app/target/*.tar.gz /home/node/packages/bongosec-dashboard
