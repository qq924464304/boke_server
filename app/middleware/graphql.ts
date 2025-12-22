// app/middleware/graphql.ts
import { Application } from "egg";
import { ApolloServer } from "apollo-server-koa";
import schema from "../graphql"; // 你的 Nexus schema
import { AuthenticationError } from "apollo-server-koa";

export default (app: Application) => {
  const server = new ApolloServer({
    schema,
    context: async ({ ctx }) => {
      try {
        console.log("=== GraphQL Context Initialized ===");
        const { authorization } = ctx.req.headers;
        if (authorization) {
          // const token = app.service.encryption.decodeToken(
          //   authorization as string
          // );
          // const {
          //   sub: { adminId, adminLoginAccountId },
          // } = token;
          // if (adminId) {
          //   const admin = await app.db.admin.findUnique({
          //     where: { id: adminId },
          //     include: { platform: true },
          //   });
          //   ctx.admin = admin;
          // }
          // if (adminLoginAccountId) {
          //   const adminLoginAccount = await app.db.adminLoginAccount.findUnique(
          //     {
          //       where: { id: adminLoginAccountId },
          //     }
          //   );
          //   ctx.adminLoginAccount = adminLoginAccount;
          // }
          // ctx.token = token;
        }
        return ctx;
      } catch (error) {
        app.logger.error("GraphQL auth error:", error);
        throw new AuthenticationError("登录已过期，请重新登录");
      }
    },
    formatError: (error) => {
      if (app.config.env !== "prod") {
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
  });

  // 👇 核心：提取中间件
  const middlewares: any[] = [];
  const proxyApp = {
    use: (m: any) => middlewares.push(m),
  };

  server.applyMiddleware({
    app: proxyApp as any,
    path: "/graphql",
    cors: false, // Egg 已处理 CORS
    // bodyParser: false, // Egg 已处理 body
  });

  // 返回组合后的中间件
  return middlewares[0]; // applyMiddleware 只会 push 一个中间件
};
