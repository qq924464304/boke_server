import * as Nexus from "@nexus/schema";
import { AdminRoleEnum } from "@prisma/client";

export default Nexus.enumType({
  name: "AdminRoleEnum",
  description: "用户角色枚举 管理员SUPERADMIN 店铺管理员ADMIN",
  members: Object.keys(AdminRoleEnum).map((item) => {
    let description: string;
    switch (item) {
      case "CASHREGISTER": {
        description = "收银机服务器";
        break;
      }
      case "SUPERADMIN": {
        description = "超管";
        break;
      }
      case "GENERALADMIN": {
        description = "总部管理";
        break;
      }
      case "GENERALSTAFF": {
        description = "总部运营";
        break;
      }
      case "ADMIN": {
        description = "管理员";
        break;
      }
      case "STAFF": {
        description = "员工";
        break;
      }
      default: {
        description = "未配置类型";
        break;
      }
    }
    return { name: item, description };
  }),
});
