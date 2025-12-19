import { plugin } from "@nexus/schema";
import moment from "moment";

export default plugin({
  name: "LogPlugin",
  onCreateFieldResolver() {
    return async (root, args, ctx, info, next) => {
      const {
        fieldName,
        parentType: { name: parentType },
      } = info;

      if (parentType === "Query" || parentType === "Mutation") {
        ctx.logger.debug(`=> ${fieldName}`, {
          parentType,
          fieldName,
          args,
          token: ctx.token,
          now: moment().format(),
        });
      }
      const startTimeMs = new Date().valueOf();
      const value = await next(root, args, ctx, info);
      const endTimeMs = new Date().valueOf();
      if (parentType === "Query" || parentType === "Mutation") {
        ctx.logger.debug(`<= ${fieldName}`, {
          parentType,
          fieldName,
          time: `共计耗时${endTimeMs - startTimeMs}ms`,
        });
      }
      return value;
    };
  },
});
