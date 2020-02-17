import { DataType } from './Field.Type';
import { IComparable } from '@trapize/core';
import { IModel } from './IModel';

/**
 *
 *
 * @export
 * @interface IFieldDescribeResult
 * @extends {IComparable<IFieldDescribeResult>}
 */
export interface IFieldDescribeResult extends IComparable<IFieldDescribeResult> {
    /**
     *
     *
     * @type {string}
     * @memberof IFieldDescribeResult
     */
    field: string;
    /**
     *
     *
     * @type {string}
     * @memberof IFieldDescribeResult
     */
    column: string;
    /**
     *
     *
     * @type {typeof DataType}
     * @memberof IFieldDescribeResult
     */
    type: typeof DataType;
    /**
     *
     *
     * @type {boolean}
     * @memberof IFieldDescribeResult
     */
    required: boolean;
    /**
     *
     *
     * @type {boolean}
     * @memberof IFieldDescribeResult
     */
    isPrimaryKey: boolean;

    /**
     *
     *
     * @type {boolean}
     * @memberof IFieldDescribeResult
     */
    isForeignKey: boolean;
    
    /**
     *
     *
     * @type {boolean}
     * @memberof IFieldDescribeResult
     */
    isReadonly: boolean;
    /**
     *
     *
     * @type {boolean}
     * @memberof IFieldDescribeResult
     */
    isAutoIncrement: boolean;
    /**
     *
     *
     * @type {boolean}
     * @memberof IFieldDescribeResult
     */
    isRequired: boolean;
    /**
     *
     *
     * @type {boolean}
     * @memberof IFieldDescribeResult
     */
    isCalculated: boolean;
    /**
     *
     *
     * @type {number}
     * @memberof IFieldDescribeResult
     */
    order: number;
    /**
     *
     *
     * @type {*}
     * @memberof IFieldDescribeResult
     */
    defaultValue: any;
    /**
     *
     *
     * @type {string}
     * @memberof IFieldDescribeResult
     */
    alias: string;
    /**
     *
     *
     * @param {IModel} model
     * @returns {boolean}
     * @memberof IFieldDescribeResult
     */
    getIsInsertable(model: IModel): boolean;
    /**
     *
     *
     * @param {IModel} model
     * @returns {boolean}
     * @memberof IFieldDescribeResult
     */
    getIsUpdateable(model: IModel): boolean;
    /**
     *
     *
     * @param {string} alias
     * @returns {string}
     * @memberof IFieldDescribeResult
     */
    getAliasedColumn(alias: string): string;
}

/**
 *
 *
 * @export
 * @param {*} obj
 * @returns {obj is IFieldDescribeResult}
 */
export function isIFieldDescribeResult(obj: any): obj is IFieldDescribeResult {
    return obj && typeof obj === 'object' &&
    'field' in obj &&
    'column' in obj &&
    'type' in obj &&
    'getIsInsertable' in obj &&
    'getIsUpdateable' in obj &&
    'getAliasedColumn' in obj &&
    typeof obj.getIsInsertable === 'function' &&
    typeof obj.getIsUpdateable === 'function' &&
    typeof obj.getAliasedColumn === 'function';
}