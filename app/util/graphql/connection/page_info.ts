import _ from 'lodash';
import { getConnectionTypeByArgs } from "./connection_type";
import { TypeOfArgs, TypeOfEdges } from "./type";

interface TypeOfGetPageInfoParams {
  args: TypeOfArgs;
  edges: TypeOfEdges;
  totalCount: number;
}

// 获得页面信息
export const getPageInfo = (params: TypeOfGetPageInfoParams) => {
  const { args, edges } = params;

  const { length: edgesLength } = edges;

  const cursorInfo = {
    startCursor: edgesLength ? edges[0].cursor : null,
    endCursor: edgesLength ? edges[edgesLength - 1].cursor : null,
  };

  let hasPageInfo;

  const gotConnectionType = getConnectionTypeByArgs(args);

  switch (gotConnectionType) {
    case "CURSOR": {
      const { first, last } = args;

      hasPageInfo = {
        hasNextPage: !!(last && last === edgesLength),
        hasPreviousPage: !!(first && first === edgesLength),
      };

      break;
    }

    case "PAGE": {
      const { totalCount } = params;

      const { limit, offset: rawOffset } = args;

      const offset = rawOffset || 0;

      hasPageInfo = {
        hasPreviousPage: !!offset,
        hasNextPage: edgesLength === limit && offset + limit < totalCount,
      };

      break;
    }
  }

  return Object.assign(cursorInfo, hasPageInfo);
};
