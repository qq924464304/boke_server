// config/plugin.ts
import { EggPlugin } from "egg";

const plugin: EggPlugin = {
  // ... 其他插件
  graphql: {
    enable: true,
    package: "egg-graphql",
  },
  validate: {
    enable: true,
    package: "egg-validate",
  },
  // 路由模块
  routerPlus: {
    enable: true,
    package: "egg-router-plus",
  },
  // redis模块
  redis: {
    enable: true,
    package: "egg-redis",
  },
};

export default plugin;
