# 使用 LTS Node 版本
FROM node:18-alpine AS base

WORKDIR /app

# 安装依赖（利用 Docker 层缓存）
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# 复制源码
COPY . .

# 构建 TypeScript
RUN npm run build

# 运行时镜像（可选：多阶段构建更小）
FROM node:18-alpine AS runtime

WORKDIR /app

# 只复制必要文件
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/prisma ./prisma

# 安装 Prisma CLI（用于迁移）
RUN npx prisma generate

# 默认端口
EXPOSE 4000

# 启动命令（由外部注入环境变量）
CMD ["npm", "start"]