import { describe, expect, test } from "@jest/globals";
import { sign } from "./sign";

describe("签名", () => {
  test("生成签名", () => {
    expect(
      sign({
        url: "https://waimaiopen.meituan.com/api/v1/order/getOrderDaySeq",
        signParams: {
          app_id: "0000",
          timestamp: "1389751221",
          app_poi_code: "31号测试店",
        },
        appSecret: "864be81325af06a24a806277bb084701",
      }),
    ).toBe("95f7dc02f936cdd293d3aa8ec881eaa4");
  });
});
