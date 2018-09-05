git pull
yarn --registry=https://registry.npm.taobao.org/
yarn build
rm -fr /usr/share/nginx/html/moby-platform-dashboard
mv dist /usr/share/nginx/html/moby-platform-dashboard
