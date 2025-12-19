import { b64encode } from "@waiting/base64";
import _ from "lodash";
import { TypeOfNodes } from "../type";
import { TypeOfEdges } from "./type";

export interface TypeOfGetEdgesParams {
  nodes: TypeOfNodes;
  primaryKeyName?: string | null;
  multiplePrimaryKey?: boolean;
}

// 获得边线组
export const getEdges = (params: TypeOfGetEdgesParams): TypeOfEdges => {
  const { nodes, primaryKeyName, multiplePrimaryKey } = params;

  console.log(nodes, primaryKeyName, multiplePrimaryKey);
  return nodes.map((node) => {
    let primaryKey;

    if (primaryKeyName) {
      if (multiplePrimaryKey) {
        const primaryKeyNames = primaryKeyName.split("_");
        const primaryKeyJson: any = {};
        primaryKeyNames.forEach((primaryKeyNameItem) => {
          primaryKeyJson[primaryKeyNameItem] = node[primaryKeyNameItem];
        });
        primaryKey = JSON.stringify(primaryKeyJson);
      } else {
        primaryKey = node[primaryKeyName];
      }
    } else {
      primaryKey = node.id;
    }

    return {
      cursor: b64encode(primaryKey),
      node,
    };
  });
};
