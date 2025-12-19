import * as prismaClient from "@prisma/client";
import { Prisma } from "@prisma/client";
import { UserInputError } from "apollo-server-koa";
import moment from "moment";

const prisma = new prismaClient.PrismaClient();

// 开启假删除的model
const name: Prisma.ModelName[] = [];

prisma.$use(async (params, next) => {
  if (name.find((item) => params.model === item)) {
    const deletedTime = moment().toDate();

    switch (params.action) {
      case "findUnique":
      case "findFirst": {
        params.action = "findFirst";
        if (!params.args.where.deletedAt) {
          params.args.where.OR = [{ deletedAt: null }, { deletedAt: { gt: moment().utc().toDate() } }];
        }
        break;
      }
      case "aggregate":
      case "findMany": {
        if (params.args && params.args.where) {
          if (params.args.where.OR && params.args.where.OR.length) {
            // 此处应该使用笛卡尔积(目前未使用)
            params.args.where.OR.push({ deletedAt: null }, { deletedAt: { gt: moment().utc().toDate() } });
          } else {
            params.args.where.OR = [{ deletedAt: null }, { deletedAt: { gt: moment().utc().toDate() } }];
          }
        } else {
          params.args = { where: { OR: [{ deletedAt: null }, { deletedAt: { gt: moment().utc().toDate() } }] } };
        }
        break;
      }
      case "delete": {
        params.action = "update";
        params.args.data = { deletedAt: deletedTime };
        break;
      }
      case "deleteMany": {
        params.action = "updateMany";
        if (params.args.data) {
          params.args.data.deletedAt = deletedTime;
        } else {
          params.args.data = { deletedAt: deletedTime };
        }
        break;
      }
    }

    // console.log("prisma中间件", params);
  }

  try {
    return await next(params);
  } catch (error: any) {
    console.error("数据库出错:", JSON.stringify(params, null, 2), error.code);
    switch (error.code) {
      case "P2025":
        throw new UserInputError("记录不存在");

      default:
        throw new Error(error);
    }
  }
});

export default prisma;
