import DataLoader = require('dataloader');
import prisma from '../index';

interface TypeOfGetLoaderParams {
  // 模型名称
  modelName: string;

  // 主键名称
  primaryKeyName?: string;
}

export const getLoader = (params: TypeOfGetLoaderParams) => {
  const { modelName, primaryKeyName: rawPrimaryKeyName } = params;

  const primaryKeyName = rawPrimaryKeyName || 'id';

  return new DataLoader(async (keyList: readonly string[]) => {
    console.debug('getLoader keyList', keyList);

    // @ts-ignore
    const model = prisma[modelName];

    if (!model) {
      return;
    }

    const foundList = await model.findMany({
      where: {
        [primaryKeyName]: {
          in: keyList,
        },
      },
    });

    console.debug('getLoader foundList', foundList);

    return foundList;
  });
};
