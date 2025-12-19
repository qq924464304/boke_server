import { TypeOfNode } from "../type";

export type TypeOfArgs = Record<string, any>;

export interface TypeOfEdge {
  cursor: string;
  node: TypeOfNode;
}

export type TypeOfEdges = TypeOfEdge[];

export type TypeOfOrderByType = "desc" | "asc" | undefined;

export interface TypeOfOrderByWithRelationInput {
  [key: string]: TypeOfOrderByType | TypeOfOrderByWithRelationInput;
}

export type TypeOfOrderByWithRelationInputList = TypeOfOrderByWithRelationInput[];
