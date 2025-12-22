import { EggAppConfig, PowerPartial } from "egg";
import schema from "../app/graphql"; // Adjusted path to the Nexus schema
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
  // console.log("--- Config Keys Loading:", config.keys);
  // Egg.js 使用 config.keys 作为 Cookie 加密和签名的密钥（用于 session、CSRF 保护等安全功能）。
  // config.keys =  // 建议使用动态生成的密钥
  // 中间件
  // config.middleware = ["graphql"];

  // Usage: `app.config.bizConfig.sourceUrl`
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  // 👇 关键配置：忽略 /graphql 的 CSRF 检查
  config.security = {
    csrf: {
      ignore: ["/graphql"], // 忽略该路径的 CSRF 验证
    },
  };

  // console.log("--- schema", schema);

  // config.apolloServer = {
  //   path: "/graphql", // 路由路径
  //   graphiql: true, // 开启 Playground（开发环境）
  //   apolloServerOptions: {
  //     schema, // 你的 Nexus schema
  //     context: async ({ ctx }) => {
  //
  //       try {
  //         const { authorization } = ctx.req.headers;
  //         if (authorization) {
  //           const token = ctx.service.encryption.decodeToken(
  //             authorization as string
  //           );
  //           const {
  //             sub: { adminId, adminLoginAccountId },
  //           } = token;

  //           if (adminId) {
  //             const admin = await ctx.db.admin.findUnique({
  //               where: { id: adminId },
  //               include: { platform: true },
  //             });
  //             ctx.admin = admin;
  //           }
  //           if (adminLoginAccountId) {
  //             const adminLoginAccount =
  //               await ctx.db.adminLoginAccount.findUnique({
  //                 where: { id: adminLoginAccountId },
  //               });
  //             ctx.adminLoginAccount = adminLoginAccount;
  //           }
  //           ctx.token = token;
  //         }
  //         return ctx;
  //       } catch (error) {
  //         ctx.logger.error("GraphQL auth error:", error);
  //         throw new AuthenticationError("登录已过期，请重新登录");
  //       }
  //     },
  //     formatError: (error) => {
  //       if (process.env.NODE_ENV !== "production") {
  //         console.error("GraphQL error:", error);
  //       }
  //       switch (error.originalError?.name) {
  //         case "NotFoundError":
  //           return { message: "记录不存在", code: "NOT_FOUND" };
  //         case "AuthenticationError":
  //           return { message: "未授权", code: "UNAUTHORIZED" };
  //         default:
  //           return { message: "服务器内部错误", code: "INTERNAL_ERROR" };
  //       }
  //     },
  //   },
  // };

  config.logger = {
    consoleLevel: "INFO",
  };
  // console.log("--- Config Keys Loading:111", config.graphql);
  return {
    ...config,
    bizConfig,
  };
};
