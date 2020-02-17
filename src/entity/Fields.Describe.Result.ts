/* istanbul ignore file */
import { IFieldsDescribeResult } from './IFields.Describe.Result';
import { IFieldDescribeResult } from './IField.Describe.Result';

/**
 *
 *
 * @export
 * @class FieldsDescriberResult
 * @implements {IFieldsDescribeResult}
 */
export class FieldsDescriberResult implements IFieldsDescribeResult {
    [field: string]: IFieldDescribeResult;
}