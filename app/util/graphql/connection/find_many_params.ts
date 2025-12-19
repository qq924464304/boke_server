import { b64decode } from "@waiting/base64";
import { getConnectionTypeByArgs } from "./connection_type";
import { getOrderBy } from "./order_by";
import { TypeOfOrderByWithRelationInputList, TypeOfArgs } from "./type";

interface TypeOfGetDefaultFindManyParamsParams {
  args: TypeOfArgs;
  defaultOrderByInputList: TypeOfOrderByWithRelationInputList;
  primaryKeyName?: string;
  isIntPrimaryKey?: boolean;
  multiplePrimaryKey?: boolean;
}

const getDefaultFindManyParams = (params: TypeOfGetDefaultFindManyParamsParams) => {
  const { args, defaultOrderByInputList, primaryKeyName, isIntPrimaryKey, multiplePrimaryKey } = params;

  const defaultFindManyParams: any = {};

  const gotConnectionType = getConnectionTypeByArgs(args);

  switch (gotConnectionType) {
    case "CURSOR": {
      const { after, before, first, last } = args;

      const cursor = after || before;

      if (cursor) {
        defaultFindManyParams.cursor = {};
        if (primaryKeyName) {
          if (multiplePrimaryKey) {
            defaultFindManyParams.cursor[primaryKeyName] = JSON.parse(b64decode(cursor));
          } else {
            defaultFindManyParams.cursor[primaryKeyName] = isIntPrimaryKey
              ? Number(b64decode(cursor))
              : b64decode(cursor);
          }
        } else {
          defaultFindManyParams.cursor.id = isIntPrimaryKey ? Number(b64decode(cursor)) : b64decode(cursor);
        }
      }

      const take = first || last;

      if (take) {
        defaultFindManyParams.take = cursor ? take + 1 : take;
      }

      break;
    }

    case "PAGE": {
      const { limit, offset } = args;

      const take = limit;

      if (take) {
        defaultFindManyParams.take = take;
      }

      const skip = offset;

      if (skip) {
        defaultFindManyParams.skip = skip;
      }

      break;
    }
  }

  defaultFindManyParams.orderBy = getOrderBy({ args, defaultOrderByInputList });

  return defaultFindManyParams;
};

interface TypeOfGetFindManyParamsParams {
  args: TypeOfArgs;
  extraFindManyParams: any;
  defaultOrderByInputList: TypeOfOrderByWithRelationInputList;
  primaryKeyName?: string;
  isIntPrimaryKey?: boolean;
  multiplePrimaryKey?: boolean;
}

export const getFindManyParams = (params: TypeOfGetFindManyParamsParams) => {
  const { extraFindManyParams } = params;

  const defaultFindManyParams = getDefaultFindManyParams(params);

  const findManyParams = Object.assign(defaultFindManyParams, extraFindManyParams);

  return findManyParams;
};
