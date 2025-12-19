import express from "express";
import _ from "lodash";
import moment from "moment";
// import path from "path";
const Snowflake = require("@axihe/snowflake");
import os from "os";
import { IncomingMessage } from "http";

/**
 * 生成随机数
 */
export const getRandChar = () => {
  return Math.random().toString(36).substr(2, 15);
};

/**
 * 生成指定位数的随机数
 * @param length 位数
 */
export const getRandCharByLen = (length: number) => {
  const chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678"; /** 默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1 **/
  const maxPos = chars.length;
  let nonce_str = "";
  for (let i = 0; i < length; i++) {
    nonce_str += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return nonce_str;
};

/** 地球半径 */
const EARTH_RADIUS = 6.371229 * 1e6;
/** 计算直线距离 单位米 */
export const calculateDistance = (lng1: number, lat1: number, lng2: number, lat2: number) => {
  const x = ((lng2 - lng1) * Math.PI * EARTH_RADIUS * Math.cos((((lat1 + lat2) / 2) * Math.PI) / 180)) / 180;
  const y = ((lat1 - lat2) * Math.PI * EARTH_RADIUS) / 180;

  // 默认是米
  return Math.hypot(x, y);
};

/**
 * 通过whereInputParams获取where语句
 * @param whereInputParams
 */
export const getSqlWhereQueryStrByWhereInputParams = (whereInputParams: any, storeIdListByRole: string[]) => {
  if (JSON.stringify(whereInputParams) === "{}") {
    return "";
  }
  let str = "WHERE ";

  for (const objItem in whereInputParams) {
    if (whereInputParams[objItem] || whereInputParams[objItem] === 0) {
      // console.log(typeof whereInputParams[objItem], "objItems");

      const type = typeof whereInputParams[objItem];
      // if (type === "string") {
      //   str += `"${objItem}" = '${whereInputParams[objItem]}' AND `;
      //   console.log(1);
      // } else {
      //   str += `"${objItem}" = ${whereInputParams[objItem]} AND `;
      // }
      storeIdListByRole.forEach((item: string) => {
        if (type === "object") {
          str += `"${objItem}" = '${item}' OR `;
        } else {
          str += `"${objItem}" = ${item} OR `;
        }
      });
    }
    // if (storeIdListByRole.length > 0) {
    //   // whereInputParams.id = { in: storeIdListByRole };
    //   console.log(storeIdListByRole);
    // }
  }
  return `${str.slice(0, -4)} `;
};

/**
 * 生成指定位数的随机数
 * @param length 位数
 */
export const getRandNumberByLen = (length: number) => {
  const chars = "0123456789";
  const maxPos = chars.length;
  let nonce_str = "";
  for (let i = 0; i < length; i++) {
    nonce_str += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return nonce_str;
};

/**
 * 生成订单号
 */
export const generatedTradeId = () => {
  const totalLenght = 32;
  let trade = `${moment().format("YYYYMMDD")}`;

  for (let i = 0; i < totalLenght - trade.length; i++) {
    const num = Math.floor(Math.random() * 10);
    trade += num;
  }
  return trade;
};

export const getOrigIp = (req: IncomingMessage) => {
  const xForwardedFor = req.headers["x-forwarded-for"];

  if (typeof xForwardedFor === "string") {
    return xForwardedFor.split(",")[0];
  } else if (typeof xForwardedFor === "object") {
    return xForwardedFor[0];
  }
  return "183.160.3.15";
};

const snowflakeConfig = {
  worker_id: 0,
  datacenter_id: 0,
};
const idWorker = new Snowflake(snowflakeConfig.worker_id, snowflakeConfig.datacenter_id);
/**
 * 雪花算法获取id
 */
export const getSnowflakeId = (): string => {
  // 需要生成的时候，使用 `.nextId()` 方法
  const id = idWorker.nextId();
  return id.toString();
};

export const jsonParse = (text: string) => {
  try {
    return JSON.parse(text);
  } catch (error) {
    return text;
  }
};

/**
 * 是否是https网址
 * @param url
 */
export const isWebUrl = (url: string) => {
  const reg = /(([hH][tT]{2}[pP])|([hH][tT]{2}[pP][sS])):\/\/(([A-Za-z0-9-_~]+)\.)+([A-Za-z0-9-_~\/])+$/;
  return reg.test(url);
};

export const getip = () => {
  const interfaces = os.networkInterfaces();

  for (const interfaceItem in interfaces) {
    const iface = interfaces[interfaceItem]!;
    for (let i = 0; i < iface.length; i++) {
      const alias = iface[i];

      if (alias.family === "IPv4" && alias.address !== "127.0.0.1" && !alias.internal) {
        return alias.address;
      }
    }
  }
};

/**
 * 计算两个日期间所有日期
 * @param from
 * @param to
 */
export const getDateListByFromAndTo = (from: string, to: string) => {
  const dateList: string[] = [];

  const momentFrom = moment(from);

  do {
    dateList.push(momentFrom.format("YYYYMMDD"));
    momentFrom.add(1, "day");
  } while (momentFrom.isSameOrBefore(to));

  return dateList;
};

/**
 * 计算两个日期间所有时间戳
 * @param timeGranularity 时间粒度，单位分钟，默认为一天
 */
export const getDateListByFromAndToV2 = (from: string, to: string, timeGranularity: number | null = 1440) => {
  const dateList: number[] = [];

  const momentFrom = moment(from).startOf("day");
  const momentTo = moment(to).endOf("day");

  do {
    dateList.push(momentFrom.unix());
    momentFrom.add(timeGranularity, "minutes");
  } while (momentFrom.isSameOrBefore(momentTo));

  return dateList;
};

export const getDateBetween = (from: string, to: string) => {
  to = moment(to).add(1, "days").format("YYYY-MM-DD");
  const arr: string[] = [];
  while (moment(from).isBefore(to)) {
    arr.push(moment(from).format("YYYY-MM-DD"));
    from = moment(from).add(1, "days").format("YYYY-MM-DD");
  }
  return arr;
};
