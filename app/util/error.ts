import _ from "lodash";

export const errorByMessage = (message: string): Error => {
  return new Error(`${message}.`);
};

export const invalidSwitchCase = (key: string): Error => {
  return errorByMessage(`Invalid ${key} switch`);
};

type invalidInputParams = string | string[];

export const invalidInputByParams = (params: invalidInputParams): Error => {
  if (_.isArray(params)) {
    switch (params.length) {
      case 1:
        return new Error(`Invalid ${params[0]} input.`);

      case 2:
        return new Error(`Invalid ${params[0]} or ${params[1]} input.`);

      default:
        return new Error(`Invalid ${(params as string[]).join("/")} input.`);
    }
  }

  return new Error(`Invalid ${params} input.`);
};

export const invalidKeyParams = (key: string): Error => {
  return new Error(`Invalid ${key} params.`);
};

export const noDataFound = (key: string): Error => {
  return new Error(`No ${key} found.`);
};

export const noKeyParams = (key: string): Error => {
  return new Error(`No ${key} params.`);
};
