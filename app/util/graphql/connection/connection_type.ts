import { TypeOfArgs } from "./type";

export const getConnectionTypeByArgs = (
  args: TypeOfArgs,
): "CURSOR" | "PAGE" => {
  const { first, last } = args;

  // 默认为 PAGE 类型
  let type: "CURSOR" | "PAGE" = "PAGE";

  // 有 first 或 last 参数时，即为 CURSOR 类型
  if (first || last) {
    type = "CURSOR";
  }

  return type;
};
