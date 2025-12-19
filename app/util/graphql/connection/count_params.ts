import _ from 'lodash';

export const getCountParamsByFindManyParams = <TypeOfFindManyParams>(
  findManyParams: TypeOfFindManyParams,
) => {
  return _.pick(findManyParams, ["where"]);
};
