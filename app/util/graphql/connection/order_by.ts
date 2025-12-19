import _ from 'lodash';
import { TypeOfArgs, TypeOfOrderByWithRelationInputList } from './type';

const getReverseOrderByType = (orderByType: any): any => {
  switch (orderByType) {
    case 'asc': {
      return 'desc';
    }

    case 'desc':
    default: {
      return 'asc';
    }
  }
};

const getReverseOrderByDefaultOrderBy = (defaultOrderByInputList: TypeOfOrderByWithRelationInputList) => {
  return defaultOrderByInputList.map((defaultOrderByInput) => {
    return _.mapValues(defaultOrderByInput, (value) => {
      return getReverseOrderByType(value);
    });
  });
};

interface TypeOfGetOrderByParams {
  args: TypeOfArgs;
  defaultOrderByInputList: TypeOfOrderByWithRelationInputList;
}

// 获得排序依据
export const getOrderBy = (params: TypeOfGetOrderByParams) => {
  const { args, defaultOrderByInputList } = params;

  const { first } = args;

  if (first) {
    return getReverseOrderByDefaultOrderBy(defaultOrderByInputList);
  }

  return defaultOrderByInputList;
};
