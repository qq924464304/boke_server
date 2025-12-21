import * as Nexus from "@nexus/schema";

export default Nexus.objectType({
  // 名称
  name: "Admin",

  // 描述
  description: "用户",

  // 定义
  definition(t) {
    // 实施节点
    t.implements("Node");
    t.string("name", { description: "管理员名称" });
    t.list.string("storeIdList", { description: "店铺id" });
    t.field("role", { type: "AdminRoleEnum", description: "账号角色" });
    t.field("adminLoginAccount", { type: "AdminLoginAccount" });
    t.field("status", { type: "BaseStatusEnum" });
    t.string("generalId", { description: "总部id" });
    t.field("general", { type: "General" });
    t.string("platformId", { description: "平台id" });
    t.field("platform", { type: "Platform" });
    t.list.string("storeIdList", { description: "店铺id" });
    t.list.field("adminAuthorityRelation", { type: "AdminAuthorityRelation", deprecation: "员工关系" });
  },
});
