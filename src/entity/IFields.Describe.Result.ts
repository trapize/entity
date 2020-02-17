import { IFieldDescribeResult } from './IField.Describe.Result';

/**
 *
 *
 * @export
 * @interface IFieldsDescribeResult
 */
export interface IFieldsDescribeResult {
    [field: string]: IFieldDescribeResult;
}