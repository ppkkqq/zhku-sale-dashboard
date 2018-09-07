git pull
yarn --registry=https://registry.npm.taobao.org/
yarn build
rm -fr /usr/share/nginx/html/yunding-platform-dashboard
mv dist /usr/share/nginx/html/yunding-platform-dashboard
