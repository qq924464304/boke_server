// // app/router.ts
// import { Application } from "egg";

// export default (app: Application) => {
//   const { router, controller, graphql } = app;

//   // 👇 关键：手动注册 GraphQL 路由
//   if (graphql) {
//     router.all("/graphql", graphql);
//   }

//   // 其他你的 API 路由...
//   // router.get('/api/xxx', controller.xxx.index);
// };

// import axios from "axios";
import { Application } from "egg";

export default (app: Application) => {
  const { router } = app;

  // 其他路由...
  // router.get('/api/posts', app.controller.post.list);

  //   // config/config.default.ts
  // config.middleware = ['graphql']; // 但这样会拦截所有请求！
  // 👇 手动挂载 GraphQL 中间件（关键！）
  router.all("/graphql", app.middleware.graphql());
};
