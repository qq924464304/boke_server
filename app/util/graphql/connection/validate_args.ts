import { errorByMessage } from "../../error";
import { getConnectionTypeByArgs } from "./connection_type";
import { TypeOfArgs } from "./type";

const validateArgs = (args: TypeOfArgs) => {
  const { first, last, before, after, limit, offset } = args;

  try {
    // 运回值不能为 0
    if ([first, last, limit].includes(0)) {
      throw errorByMessage("Take number can not be zero");
    }

    const gotConnectionType = getConnectionTypeByArgs(args);

    switch (gotConnectionType) {
      case "CURSOR": {
        if (first && last) {
          throw errorByMessage('Cursor type connection field requires a "first" or "last" argument, not both');
        }

        if (first && before) {
          throw errorByMessage('Cursor type connection field does not allow a "before" argument with "first"');
        }

        if (last && after) {
          throw errorByMessage('Cursor type connection field does not allow a "last" argument with "after"');
        }

        if (limit || offset !== undefined) {
          throw errorByMessage('Cursor type connection field can not have "limit" or "offset"');
        }

        break;
      }

      case "PAGE": {
        if (after || before) {
          throw errorByMessage('Page type connection field can not have "after" or "before"');
        }

        break;
      }
    }
  } catch (error: any) {
    console.debug("error.message", error.message);

    switch (error.message) {
      // 抛出真实错误

      case errorByMessage("Take number can not be zero").message:
      case errorByMessage('Cursor type connection field requires a "first" or "last" argument, not both').message:
      case errorByMessage('Cursor type connection field does not allow a "before" argument with "first"').message:
      case errorByMessage('Cursor type connection field does not allow a "last" argument with "after"').message:
      case errorByMessage('Cursor type connection field can not have "limit" or "offset"').message:
      case errorByMessage('Page type connection field can not have "after" or "before"').message: {
        throw error;
      }
    }
  }
};

export default validateArgs;
