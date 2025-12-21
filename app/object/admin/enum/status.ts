import * as Nexus from "@nexus/schema";
import { BaseStatusEnum } from "@prisma/client";

export default Nexus.enumType({
  name: "BaseStatusEnum",
  description: "用户状态",
  members: Object.keys(BaseStatusEnum).map((item) => {
    let description: string;
    switch (item) {
      case BaseStatusEnum.ON: {
        description = "可用";
        break;
      }
      case BaseStatusEnum.OFF: {
        description = "禁用";
        break;
      }

      default: {
        description = "未知状态";
        break;
      }
    }
    return { name: item, description };
  }),
});
