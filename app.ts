// import { Application, Context } from "egg";
// import {
//   ApolloServer,
//   AuthenticationError,
//   toApolloError,
// } from "apollo-server-koa";
// import compose from "koa-compose";
// import schema from "../graphql";
// import { Admin } from "@prisma/client";
// import moment from "moment";

// const isDev = process.env.NODE_ENV !== "production";

// export default (_, app: Application) => {
//   const graphqlConfig = app.config.graphql;

//   const options = { ...graphqlConfig };

//   const { graphiql = true, router, ...ApolloServerConfig } = options;

//   const server = new ApolloServer({
//     schema,
//     context: async (options) => {
//       const { ctx } = options as { ctx: Context };
//       // console.log(ctx, "ctx");
//       try {
//         const { authorization } = ctx.req.headers;
//         let token: any = null;
//         let admin: Admin | null = null;
//         let adminLoginAccount: any | null = null;

//         if (authorization) {
//           token = ctx.service.encryption.decodeToken(authorization as string);
//           // console.log(token, "token");
//           const {
//             sub: { adminId, adminLoginAccountId },
//           } = token;
//           if (adminId) {
//             // console.log(adminId, "adminId");
//             admin = await ctx.db.admin.findUnique({
//               where: { id: adminId },
//               rejectOnNotFound: true,
//               include: { platform: true },
//             });
//             // console.log(admin, "admin");
//           }
//           if (adminLoginAccountId) {
//             // console.log(4, "4");
//             adminLoginAccount = await ctx.db.adminLoginAccount.findUnique({
//               where: { id: adminLoginAccountId },
//               rejectOnNotFound: true,
//             });
//           }

//           ctx.token = token;
//           ctx.admin = admin;
//           ctx.adminLoginAccount = adminLoginAccount;
//           ctx.adminId = adminId;
//           ctx.adminLoginAccountId = adminLoginAccountId;
//         }

//         return ctx;
//       } catch (error) {
//         console.log(error, "error");
//         throw new AuthenticationError("登录已过期，请重新登录");
//       }
//     },
//     debug: isDev,
//     formatError: (error) => {
//       if (isDev) {
//         console.error(
//           "error",
//           moment().format(),
//           JSON.stringify(error, null, 2)
//         );
//       }

//       switch (error.name) {
//         case "ValidationError": {
//           return toApolloError(error);
//         }
//         case "GraphQLError": {
//           switch (error.originalError?.name) {
//             case "NotFoundError": {
//               error.message = "记录不存在";
//               return toApolloError(error);
//             }
//             case "AuthenticationError": {
//               return toApolloError(error, "AuthenticationError");
//             }
//             case "TypeError":
//             case "Error": {
//               console.error(
//                 "error",
//                 moment().format(),
//                 JSON.stringify(error, null, 2)
//               );
//               error.message = "Internal server error";
//               return toApolloError(error);
//             }
//             default: {
//               return toApolloError(error);
//             }
//           }
//         }
//         default: {
//           console.error("error", JSON.stringify(error, null, 2));
//           error.message = "Internal server error";
//           return toApolloError(error);
//         }
//       }
//     },
//     ...ApolloServerConfig,
//   });

//   // app.once("server", (httpServer) => {
//   //   server.installSubscriptionHandlers(httpServer);
//   // });

//   app.GraphqlServer = server;

//   const middlewares: any[] = [];

//   const proxyApp = {
//     use: (m: any) => {
//       middlewares.push(m);
//     },
//   };
//   // 启用KOA-APOLLO
//   server.applyMiddleware({
//     app: proxyApp as any,
//     path: router,
//   });

//   return compose(middlewares);
// };

import { Application } from "egg";
import * as Nexus from "@nexus/schema";
import requireAll from "require-all";
import log from "./app/util/plugin/log";
import connection from "./app/util/plugin/connection";
import { ApolloServer, AuthenticationError } from "apollo-server-koa";
import path from "path";
// import schema from "./app/graphql"; // 注意路径！
// import { Admin } from "@prisma/client";
// import moment from "moment";
import {
  DateTimeResolver,
  JSONObjectResolver,
  TimeResolver,
} from "graphql-scalars";
const dirNameList = ["interface", "mutation", "object", "query"];
import { Kind } from "graphql";

const types = dirNameList.map((dirName) => {
  return requireAll({
    // 自动加载目录下所有 .js 文件
    dirname: `${__dirname}/${dirName}`,
    filter: process.env.NODE_ENV === "production" ? /(.+)\.js$/ : /(.+)\.ts$/,
    // filter: /(.+)\.ts$/,
    recursive: true,
    resolve(obj) {
      return "default" in obj ? obj.default : obj;
    },
  });
});

const jsonScalar = Nexus.asNexusMethod(JSONObjectResolver, "json");
const dateTimeScalar = Nexus.asNexusMethod(DateTimeResolver, "date");
const timeScalar = Nexus.asNexusMethod(TimeResolver, "time");
const ImageUrl = Nexus.scalarType({
  name: "ImageUrl",
  asNexusMethod: "imageUrl",
  description: "Image url custom scalar type",
  parseValue(value) {
    return value;
  },
  serialize(value) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value);
    }
    return null;
  },
});

const schema = Nexus.makeSchema({
  types: [...types, jsonScalar, dateTimeScalar, timeScalar, ImageUrl],
  outputs: {
    schema: __dirname + "/../../schema.graphql",
    typegen: __dirname + "/../../typings.ts",
  },
  typegenAutoConfig: {
    sources: [
      {
        source: path.join(
          __dirname,
          "path",
          "to",
          "contextModule",
          "contextModule.ts"
        ),
        alias: "t",
      },
    ],
    contextType: "t.Context",
  },
  plugins: [
    log,
    Nexus.fieldAuthorizePlugin({
      formatError: (error) => {
        return error.error;
      },
    }),
    Nexus.declarativeWrappingPlugin(),
    connection,
  ],
});

const isDev = process.env.NODE_ENV !== "production";

export default (app: Application) => {
  app.beforeStart(async () => {
    const graphqlConfig = app.config.graphql || {};
    const {
      router = "/graphql",
      graphiql = true,
      ...ApolloServerConfig
    } = graphqlConfig;

    const server = new ApolloServer({
      schema,
      context: async ({ ctx }) => {
        // ... 你的 context 逻辑（略）
      },
      debug: isDev,
      formatError: (error) => {
        // ... 你的错误处理（略）
      },
      ...ApolloServerConfig,
    });

    await server.start(); // ⚠️ 必须调用！

    // 直接挂载到 Egg（Koa）应用
    server.applyMiddleware({ app: app as any, path: router });

    app.logger.info(`✅ GraphQL ready at ${router}`);
  });
};
