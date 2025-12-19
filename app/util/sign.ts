import * as crypto from "crypto";

/**
 * 对象排序
 * @param args
 */
export const sortParams = (args: any) => {
  let keys = Object.keys(args);
  keys = keys.sort();
  const newArgs: any = {};
  keys.forEach((key) => {
    newArgs[key] = args[key];
  });
  let string = "";
  for (const k in newArgs) {
    if (typeof newArgs[k] === "object") {
      string += "&" + k + "=" + JSON.stringify(newArgs[k]);
    } else {
      string += "&" + k + "=" + newArgs[k];
    }
  }
  string = string.substr(1);
  return string;
};

/**
 * md5加密
 * @param paySign
 */
export const md5 = (paySign: crypto.BinaryLike) => {
  const md5 = crypto.createHash("md5");
  md5.update(paySign);
  return md5.digest("hex");
};

/**
 * sha256加密
 * @param paySign
 */
export const sha256 = (paySign: crypto.BinaryLike) => {
  const md5 = crypto.createHash("sha256");
  md5.update(paySign);
  return md5.digest("hex");
};

/**
 * HMAC-SHA256加密
 * @param paySign
 */
export const sha256Sign = (paySign: crypto.BinaryLike, secret: string) => {
  const hash = crypto.createHmac("sha256", secret);
  hash.update(paySign);
  return hash.digest("hex");
};

/**
 * md5签名
 * @param params
 * @param secret
 */
export const md5Sign = (params: any) => {
  delete params.sign;
  // 生成签名
  const str = `${sortParams(params)}`;

  // console.log(str, "str");
  // MD5加密
  const sign = md5(str).toUpperCase();
  // json转xml

  delete params.secret;
  return { ...params, sign };
};

/**
 * 支付md5签名
 * @param params
 * @param secret
 */
export const md5SignPay = (params: any, secret: string) => {
  delete params.sign;
  // 生成签名
  const str = `${sortParams(params)}&key=${secret}`;
  // MD5加密
  const sign = md5(str).toUpperCase();
  // json转xml
  return { ...params, sign };
};
