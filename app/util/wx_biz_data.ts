import axios from "axios";
import * as crypto from "crypto";

/**
 * 微信解密
 * @param encryptedData
 * @param iv
 * @param sessionKey
 */
export const decryptData = (encryptedData: any, iv: any, sessionKey: any) => {
  sessionKey = Buffer.from(sessionKey, "base64");
  encryptedData = Buffer.from(encryptedData, "base64");
  iv = Buffer.from(iv, "base64");
  let decoded: any = "";
  // 解密
  const decipher = crypto.createDecipheriv("aes-128-cbc", sessionKey, iv);
  // 设置自动 padding 为 true，删除填充补位
  decipher.setAutoPadding(true);
  decoded = decipher.update(encryptedData, "binary", "utf8");
  decoded += decipher.final("utf8");
  decoded = JSON.parse(decoded);
  return decoded;
};
