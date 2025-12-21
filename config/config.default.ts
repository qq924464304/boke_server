import { EggAppConfig, PowerPartial } from "egg";
import schema from "../app/graphql/query"; // Adjusted path to the Nexus schema
import { Admin } from "@prisma/client";
import { AuthenticationError } from "apollo-server-koa";

export default (appInfo) => {
  const config = {
    // use for cookie sign key, should change to your own and keep security
    keys: appInfo.name + "_1734679018487_1234",

    // add your egg config in here
    middleware: [] as string[],

    // change multipart mode to file
    // @see https://github.com/eggjs/multipart/blob/master/src/config/config.default.ts#L104
    multipart: {
      mode: "file" as const,
    },
  } as PowerPartial<EggAppConfig>;
  console.log("--- Config Keys Loading:", config.keys);
  // Egg.js 使用 config.keys 作为 Cookie 加密和签名的密钥（用于 session、CSRF 保护等安全功能）。
  // config.keys =  // 建议使用动态生成的密钥
  // 中间件
  // config.middleware = ["graphql"];

  // Usage: `app.config.bizConfig.sourceUrl`
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // 👇 新增 GraphQL 配置
  config.graphql = {
    router: "/graphql", // GraphQL 路径
    app: true, // 挂载到应用
    agent: false,
    graphiql: true, // 开发环境开启 Playground
    apolloServerOptions: {
      schema, // 使用你现有的 Nexus schema
      context: async ({ ctx }) => {
        // 👇 复用你原来的认证逻辑！
        try {
          console.log("--- Config Keys Loading:", config.keys);
          const { authorization } = ctx.req.headers;
          let token: any = null;
          let admin: Admin | null = null;
          let adminLoginAccount: any | null = null;

          if (authorization) {
            token = ctx.service.encryption.decodeToken(authorization as string);
            const {
              sub: { adminId, adminLoginAccountId },
            } = token;

            if (adminId) {
              admin = await ctx.db.admin.findUnique({
                where: { id: adminId },
                rejectOnNotFound: true,
                include: { platform: true },
              });
            }
            if (adminLoginAccountId) {
              adminLoginAccount = await ctx.db.adminLoginAccount.findUnique({
                where: { id: adminLoginAccountId },
                rejectOnNotFound: true,
              });
            }

            ctx.token = token;
            ctx.admin = admin;
            ctx.adminLoginAccount = adminLoginAccount;
            ctx.adminId = adminId;
            ctx.adminLoginAccountId = adminLoginAccountId;
          }

          return ctx; // 返回给 GraphQL resolver
        } catch (error) {
          ctx.logger.error("GraphQL auth error:", error);
          throw new AuthenticationError("登录已过期，请重新登录");
        }
      },
      formatError: (error) => {
        // 👇 复用你原来的错误格式化逻辑
        if (process.env.NODE_ENV !== "production") {
          console.error("GraphQL error:", error);
        }

        switch (error.originalError?.name) {
          case "NotFoundError":
            return { message: "记录不存在", code: "NOT_FOUND" };
          case "AuthenticationError":
            return { message: "未授权", code: "UNAUTHORIZED" };
          default:
            return { message: "服务器内部错误", code: "INTERNAL_ERROR" };
        }
      },
    },
  };
  console.log("--- Config Keys Loading:", config.keys);
  return {
    ...config,
    bizConfig,
  };
};
