#!/bin/bash
# build.sh - 构建 Docker 镜像

set -e

IMAGE_NAME="registry.cn-hangzhou.aliyuncs.com/globefish/manual:ysys-server-$(date +%Y%m%d%H%M%S)"

echo "Building image: $IMAGE_NAME"

docker build -t "$IMAGE_NAME" .

# 可选：推送镜像
# docker push "$IMAGE_NAME"

echo "Build completed: $IMAGE_NAME"