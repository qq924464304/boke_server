// config/plugin.ts
import { EggPlugin } from "egg";

const plugin: EggPlugin = {
  validate: {
    enable: true,
    package: "egg-validate",
  },
  redis: {
    enable: true,
    package: "egg-redis",
  },

  routerPlus: {
    enable: true,
    package: "egg-router-plus",
  },
};

export default plugin;
