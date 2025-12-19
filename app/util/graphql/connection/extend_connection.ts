import { ObjectDefinitionBlock } from "@nexus/schema/dist/definitions/objectType";

const extendConnection = (def: ObjectDefinitionBlock<any>): void => {
  def.int("totalCount", {
    resolve: (root, _args, _ctx) => root.totalCount,
  });
};

export default extendConnection;
