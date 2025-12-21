import { getConnectionResult, getAdditionalArgs, defaultParams } from "@/util/graphql/connection";
import { tansformSelect } from "@/util/graphql/transform_select";
import * as Nexus from "@nexus/schema";
import { AdminRoleEnum, Prisma } from "@prisma/client";

const additionalArgs = getAdditionalArgs({
  // 类型
  id: Nexus.stringArg({
    description: "id",
  }),
  name: Nexus.stringArg({ description: "名称,模糊查询" }),
  generalId: Nexus.stringArg({ description: "总部id" }),
  role: Nexus.arg({ type: "AdminRoleEnum", description: "筛选超管" }),
});

// 拓展类型
export default Nexus.extendType({
  // 类型
  type: "Query",

  // 定义
  definition: (t) => {
    t.connection("adminConnection", {
      ...(defaultParams as any),
      additionalArgs,
      type: "Admin",

      // 权限认证
      authorize: (_root, _args, ctx, info) => {
        return ctx.service.authenticate.authenticate(info);
      },
      resolve: async (_root, args, ctx, info) => {
        const { db, token } = ctx;

        const {
          sub: { adminId },
        } = token;

        const { name, id, role: adminRole } = args;

        // 查询参数
        const whereInputParams: Prisma.AdminWhereInput = {};

        const role = await ctx.service.admin.findRoleByAdminId(adminId);

        switch (role) {
          case "GENERALADMIN": {
            const generalId = await ctx.service.admin.findGeneralIdByAdminId(adminId);

            whereInputParams.generalId = generalId;

            whereInputParams.role = { in: [AdminRoleEnum.GENERALADMIN, AdminRoleEnum.GENERALSTAFF] };

            break;
          }

          case "SUPERADMIN": {
            const platformId = await ctx.service.admin.findPlatformIdByAdminId(adminId);

            whereInputParams.role = AdminRoleEnum.GENERALADMIN;

            whereInputParams.platformId = platformId;

            break;
          }

          case "SYSTEMADMINISTRATOR": {
            whereInputParams.role = AdminRoleEnum.SUPERADMIN;

            break;
          }
        }

        if (id) {
          whereInputParams.id = id;
        }

        if (adminRole) {
          whereInputParams.role = adminRole;
        }

        if (name) {
          whereInputParams.name = { contains: name };
        }

        const select = tansformSelect(info.fieldNodes);

        // 解析查询参数

        const findManyParams: Prisma.AdminFindManyArgs = { select };

        if (whereInputParams) {
          findManyParams.where = whereInputParams;
        }

        // 定义默认排序
        const defaultOrderByInputList: Prisma.AdminOrderByWithRelationInput[] = [
          {
            createdAt: "desc",
          },
        ];
        // console.log(findManyParams);
        return await getConnectionResult({
          tableModel: db.admin,
          args,
          findManyParams,
          defaultOrderByInputList,
        });
      },
    });
  },
});
