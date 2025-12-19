import axios, { AxiosRequestConfig } from "axios";
import FormData from "form-data";
import _ from "lodash";
import QueryString from "qs";
import fs from "fs";
import { sign } from "./sign";
import { Readable } from "stream";

const APP_ID = "4600";

const APP_SECRET = "864be81325af06a24a806277bb084701";

export interface IRequestParams {
  method: "GET" | "POST";
  url: string;
  params: Record<string, any>;
}

/**
 * 系统参数
 */
const getSysParams = () => {
  return {
    app_id: APP_ID,
    timestamp: Math.floor(new Date().getTime() / 1000),
  };
};

/**
 * 请求美团接口方法
 * @param params 业务参数
 * @doc https://open-shangou.meituan.com/home/questionDetail/5730
 */
export const request = (params: IRequestParams) => {
  const sysParams = getSysParams();

  /**
   * 需要参与签名的参数
   */
  const signParams = {
    ...sysParams,
    ...params.params,
  };

  const signString = sign({
    ...params,
    appSecret: APP_SECRET,
    signParams,
  });

  const { url, method } = params;

  let options: AxiosRequestConfig = {};

  switch (method) {
    case "GET": {
      const data = {
        ...signParams,
        sig: signString,
      };

      options = {
        url: `${url}?${QueryString.stringify(data)}`,
        method,
      };

      break;
    }

    case "POST": {
      options = {
        url: `${url}?${QueryString.stringify({
          ...sysParams,
          sig: signString,
        })}`,
        method,
        params: params.params,
      };

      break;
    }

    default: {
      throw new Error("");
    }
  }

  console.debug("request options", options);

  return axios(options);
};

interface IUploadImageParams {
  app_poi_code: string;
  img_name: string;
  imageBuffer: Buffer;
}

export const uploadImage = async (params: IUploadImageParams) => {
  const { app_poi_code, img_name, imageBuffer } = params;

  console.log(imageBuffer);

  const sysParams = getSysParams();

  const url = "https://waimaiopen.meituan.com/api/v1/image/upload";

  /**
   * 需要参与签名的参数
   */
  const signParams = {
    ...sysParams,
    app_poi_code,
    img_name,
  };

  const signString = sign({
    url,
    appSecret: APP_SECRET,
    signParams,
  });

  const requestUrl = `${url}?${QueryString.stringify({
    ...sysParams,
    sig: signString,
  })}`;

  const formData = new FormData();

  formData.append("img_name", img_name);

  formData.append("app_poi_code", app_poi_code);

  const fileStream = bufferToReadStream(imageBuffer);

  formData.append("file", fileStream, {
    filename: "image.jpg",
    contentType: "application/octet-stream",
  });

  return axios.post(requestUrl, formData);
};

function bufferToReadStream(buffer) {
  const readStream = new Readable({
    read() {
      this.push(buffer);
      this.push(null);
    },
  });
  return readStream;
}
