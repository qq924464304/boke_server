import * as Nexus from "@nexus/schema";

// 定义默认附加参数
const defaultAdditionalArgs = {
  // （返回条目）限制数
  limit: Nexus.intArg({
    description: "（返回条目）限制数",
  }),

  // （返回条目）抵消数
  offset: Nexus.intArg({
    description: "（返回条目）抵消数",
  }),
};

// 获得附加参数
export const getAdditionalArgs = (args: any) => {
  return { ...defaultAdditionalArgs, ...args };
};
