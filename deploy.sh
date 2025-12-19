#!/bin/bash
# deploy.sh - 安全部署到服务器（prod / staging）

set -e

# ========== 从 CI/CD 或命令行传入 ==========
APP_ENV_TYPE_NAME="${APP_ENV_TYPE_NAME:-prod}"
APP_IMAGE_TAG_NAME="${APP_IMAGE_TAG_NAME}"
APP_PROJECT_NAME="ysys"
APP_MAIN_DOMAIN_NAME="hetuntech.cn"
APP_IS_USE_REDIS="${APP_IS_USE_REDIS:-FALSE}"
APP_REDIS_PASSWORD="${APP_REDIS_PASSWORD}"

# ========== 校验 ==========
if [ -z "$APP_IMAGE_TAG_NAME" ]; then
  echo "Error: APP_IMAGE_TAG_NAME is required"
  exit 1
fi

# ========== 计算变量 ==========
if [ "$APP_ENV_TYPE_NAME" = "prod" ]; then
  DOMAIN_NAME="api.$APP_PROJECT_NAME.$APP_MAIN_DOMAIN_NAME"
else
  DOMAIN_NAME="api.$APP_PROJECT_NAME-$APP_ENV_TYPE_NAME.$APP_MAIN_DOMAIN_NAME"
fi

SERVER_CONTAINER_NAME="$APP_PROJECT_NAME-server-$APP_ENV_TYPE_NAME"

# ========== 拉取镜像 ==========
echo "Pulling image: $APP_IMAGE_TAG_NAME"
docker pull "$APP_IMAGE_TAG_NAME"

# ========== 移除旧容器 ==========
echo "Removing old container: $SERVER_CONTAINER_NAME"
docker rm -f "$SERVER_CONTAINER_NAME" || true

# ========== 创建新容器 ==========
echo "Creating container: $SERVER_CONTAINER_NAME"

docker create \
  --restart always \
  --name "$SERVER_CONTAINER_NAME" \
  --env "VIRTUAL_HOST=$DOMAIN_NAME" \
  --env "VIRTUAL_PORT=4000" \
  --env "LETSENCRYPT_HOST=$DOMAIN_NAME" \
  --env "APP_ENV_CONFIG_TYPE_NAME=$APP_ENV_TYPE_NAME" \
  --env "NODE_ENV=production" \
  # 👇 敏感信息从 CI/CD Secrets 注入，不在脚本中写死！
  --env "DATABASE_URL=$DATABASE_URL" \
  --env "REDIS_PASSWORD=$APP_REDIS_PASSWORD" \
  --env "APP_IS_USE_REDIS=$APP_IS_USE_REDIS" \
  "$APP_IMAGE_TAG_NAME"

# ========== 网络 ==========
docker network connect web "$SERVER_CONTAINER_NAME" || true

# ========== Redis（按需）==========
if [ "$APP_IS_USE_REDIS" = "TRUE" ]; then
  REDIS_NAME="$APP_PROJECT_NAME-redis-$APP_ENV_TYPE_NAME"
  docker network create "$REDIS_NAME" 2>/dev/null || true
  docker run -d \
    --restart always \
    --name "$REDIS_NAME" \
    --network "$REDIS_NAME" \
    redis:5.0.7 --requirepass "$APP_REDIS_PASSWORD"
  docker network connect "$REDIS_NAME" "$SERVER_CONTAINER_NAME"
fi

# ========== 启动 ==========
docker start "$SERVER_CONTAINER_NAME"
echo "Deployment completed for $APP_ENV_TYPE_NAME"