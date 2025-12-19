import _ from "lodash";
import * as Nexus from "@nexus/schema";

interface TypeOfGetPrivilegeParams {
  fieldName: string;
  fieldDescription: string;
  privilegeList: string[];
}

export const getPrivilege = (params: TypeOfGetPrivilegeParams) => {
  const { fieldName, fieldDescription, privilegeList } = params;

  // 定义字段名称通过首字母大写
  const fieldNameByUpperFirst = _.upperFirst(fieldName);

  return Nexus.arg({
    description: "特权",
    // @ts-ignore
    type: Nexus.enumType({
      name: `${fieldNameByUpperFirst}PrivilegeEnum`,
      description: `${fieldDescription}特权枚举`,
      members: privilegeList,
    }),
    default: privilegeList[0],
  });
};
