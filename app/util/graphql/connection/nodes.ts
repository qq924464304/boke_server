import { TypeOfNodes } from "../type";
import { getConnectionTypeByArgs } from "./connection_type";
import { TypeOfArgs } from "./type";

interface TypeOfGetNodesParams<TypeOfFindManyParams> {
  tableModel: any;
  args: TypeOfArgs;
  findManyParams: TypeOfFindManyParams;
}

export const getNodes = async <TypeOfFindManyParams>(params: TypeOfGetNodesParams<TypeOfFindManyParams>) => {
  const { tableModel, args, findManyParams } = params;

  const nodes: TypeOfNodes = await tableModel.findMany(findManyParams);

  // console.log(nodes);
  const gotConnectionType = getConnectionTypeByArgs(args);

  const { after, before } = args;

  const cursor = after || before;

  if (gotConnectionType === "CURSOR" && cursor) {
    nodes.shift();
  }

  return nodes;
};
