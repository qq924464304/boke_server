/**
 * 错误
 * GraphQL 内的独有的错误。
 */

import _ from 'lodash';
import { errorByMessage } from '../error';

export const internalError = errorByMessage(`Internal error`);

export const invalidInput = errorByMessage('Invalid input');

export const notFound = errorByMessage(`Not found`);
