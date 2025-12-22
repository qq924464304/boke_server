# 使用 LTS Node 版本
FROM node:18-alpine AS base

WORKDIR /app

# 安装依赖（利用 Docker 层缓存）
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# 复制源码
COPY . .

# 构建 TypeScript 并生成 Prisma Client（如果需要）
RUN npm run build
# 注意：如果 prisma 在 devDependencies，这里可以运行 generate；
# 如果在 dependencies，build 脚本可能已自动处理。

# 运行时镜像
FROM node:18-alpine AS runtime

WORKDIR /app

# 只复制必要文件
COPY --from=base /app/dist ./dist
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./
COPY --from=base /app/prisma ./prisma

# 如果确实需要在 runtime 生成（不推荐），确保 prisma 在 dependencies
# RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "start"]