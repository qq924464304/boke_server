import { TypeOfNodes } from "../type";
import { getCountParamsByFindManyParams } from "./count_params";
import { getEdges } from "./edges";
import { getFindManyParams } from "./find_many_params";
import { getNodes } from "./nodes";
import { getPageInfo } from "./page_info";
import { TypeOfArgs, TypeOfOrderByWithRelationInputList } from "./type";

interface TypeOfGetConnectionResultParams<TypeOfFindManyParams> {
  tableModel: any;
  primaryKeyName?: string;
  args: TypeOfArgs;
  findManyParams: TypeOfFindManyParams;
  defaultOrderByInputList: TypeOfOrderByWithRelationInputList;
  // 主键类型是否是int类型
  isIntPrimaryKey?: boolean;
  // 是否是多元主键
  multiplePrimaryKey?: boolean;
}

export const getConnectionResult = async <TypeOfFindManyParams>(
  params: TypeOfGetConnectionResultParams<TypeOfFindManyParams>,
) => {
  const {
    tableModel,
    primaryKeyName,
    args,
    findManyParams: extraFindManyParams,
    defaultOrderByInputList,
    isIntPrimaryKey,
    multiplePrimaryKey,
  } = params;

  const findManyParams = getFindManyParams({
    args,
    extraFindManyParams,
    defaultOrderByInputList,
    primaryKeyName,
    isIntPrimaryKey,
    multiplePrimaryKey,
  });

  // console.log(findManyParams, "findManyParams");

  // 查找多个
  const nodes: TypeOfNodes = await getNodes({
    tableModel,
    args,
    findManyParams,
  });

  const gotCountParams = getCountParamsByFindManyParams<TypeOfFindManyParams>(findManyParams);

  // 统计数量
  const totalCount = await tableModel.count(gotCountParams);

  // 获得边线组
  const gotEdges = getEdges({
    nodes,
    primaryKeyName,
    multiplePrimaryKey,
  });

  // 获得页面信息
  const gotPageInfo = getPageInfo({
    args,
    edges: gotEdges,
    totalCount,
  });

  return {
    edges: gotEdges,
    pageInfo: gotPageInfo,
    totalCount,
  };
};
