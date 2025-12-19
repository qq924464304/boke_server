import * as crypto from "crypto";
import _ from "lodash";

export interface ISignParams {
  url: string;
  appSecret: string;
  signParams: Record<string, any>;
}

/**
 * md5加密
 * @param paySign
 */
const md5 = (paySign: crypto.BinaryLike) => {
  const md5 = crypto.createHash("md5");
  md5.update(paySign);
  return md5.digest("hex");
};

/**
 * 计算签名方法
 * @param params 参与签名的全部参数
 * @doc https://open-shangou.meituan.com/home/questionDetail/5730
 */
export const sign = (params: ISignParams) => {
  const { url, signParams, appSecret } = params;

  /**
   * 排序后的参数
   */
  const sortParamsString = _.keys(signParams)
    .sort()
    .map((key) => {
      const value = signParams[key];

      return `${key}=${value}`;
    })
    .join("&");

  /**
   * 加密前的字符串
   */
  const decodeString = `${url}?${sortParamsString}${appSecret}`;

  console.debug("decodeString", decodeString);

  return md5(decodeString);
};
