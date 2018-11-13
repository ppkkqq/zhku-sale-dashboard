git pull

#下载依赖、打包文件
docker run --rm \
  -v $PWD:/home \
  -w /home \
  node:10 sh -c "yarn --registry=http://nexus.deepexi.top/repository/npm-group/ && yarn build"

#删除容器
docker rm -f yunding-platform-dashboard &> /dev/null

# 运行容器
docker run -d --restart=on-failure:5 \
    -p 3340:80 \
    -v $PWD/dist:/usr/share/nginx/html/gtytong-platform-dashboard:ro \
    --name yunding-platform-dashboard nginx:1.13
