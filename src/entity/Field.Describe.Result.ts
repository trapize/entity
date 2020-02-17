import { IFieldDescribeResult } from './IField.Describe.Result';
import { DataType } from './Field.Type';
import { IComparable } from '@trapize/core';
import { IModel } from './IModel';

/**
 *
 *
 * @export
 * @class FieldDescribeResult
 * @implements {IFieldDescribeResult}
 * @implements {IComparable<IFieldDescribeResult>}
 */
export class FieldDescribeResult implements IFieldDescribeResult, IComparable<IFieldDescribeResult> {
    
    /**
     *
     *
     * @type {boolean}
     * @memberof FieldDescribeResult
     */
    public required: boolean = false;
    /**
     *
     *
     * @type {boolean}
     * @memberof FieldDescribeResult
     */
    public isPrimaryKey: boolean = false;

    /**
     *
     *
     * @type {boolean}
     * @memberof FieldDescribeResult
     */
    public isForeignKey: boolean = false;
    
    /**
     *
     *
     * @type {boolean}
     * @memberof FieldDescribeResult
     */
    public isReadonly: boolean = false;
    /**
     *
     *
     * @type {boolean}
     * @memberof FieldDescribeResult
     */
    public isAutoIncrement: boolean = false;
    /**
     *
     *
     * @type {boolean}
     * @memberof FieldDescribeResult
     */
    public isRequired: boolean = false;
    /**
     *
     *
     * @type {boolean}
     * @memberof FieldDescribeResult
     */
    public isCalculated: boolean = false;
    /**
     *
     *
     * @type {number}
     * @memberof FieldDescribeResult
     */
    public order: number = 0;
    /**
     *
     *
     * @type {*}
     * @memberof FieldDescribeResult
     */
    public defaultValue: any;
    /**
     *
     *
     * @type {string}
     * @memberof FieldDescribeResult
     */
    public alias: string;

    /**
     *
     *
     * @type {string}
     * @memberof FieldDescribeResult
     */
    public field: string;
    /**
     *
     *
     * @type {string}
     * @memberof FieldDescribeResult
     */
    public column: string;

    /**
     *
     *
     * @type {typeof DataType}
     * @memberof FieldDescribeResult
     */
    public type: typeof DataType;

    /**
     *Creates an instance of FieldDescribeResult.
     * @param {string} field
     * @param {string} column
     * @param {typeof DataType} type
     * @memberof FieldDescribeResult
     */
    public constructor(
        field: string,
        column: string | undefined,
        type: typeof DataType
    ) {
        this.field = field;
        this.column = column || '';
        this.type = type;
    }

    /**
     *
     *
     * @param {IFieldDescribeResult} that
     * @returns {number}
     * @memberof FieldDescribeResult
     */
    public CompareTo(that: IFieldDescribeResult): number {
        return this.order - that.order;
    }

    /**
     *
     *
     * @param {string} alias
     * @returns {string}
     * @memberof FieldDescribeResult
     */
    public getAliasedColumn(alias: string): string {
        return `${alias}.${this.column}`;
    }

    /**
     *
     *
     * @param {IModel} model
     * @returns {boolean}
     * @memberof FieldDescribeResult
     */
    public getIsInsertable(model: IModel): boolean {
        if(this.isCalculated) {
            return false;
        } else if(model.IsNew && this.isAutoIncrement) {
            return model.Get(this.field) !== undefined && model.Get(this.field) !== null;
        } else if(this.isReadonly) {
            const previousValue = model.GetPrevious(this.field)
            return previousValue === undefined || previousValue === null;
        }
        return true;
    }

    /**
     *
     *
     * @param {IModel} model
     * @returns {boolean}
     * @memberof FieldDescribeResult
     */
    public getIsUpdateable(model: IModel): boolean {
        if(this.isCalculated || this.isAutoIncrement) {
            return false;
        }
        if(this.isReadonly) {
            const previousValue = model.GetPrevious(this.field)
            return previousValue === undefined || previousValue === null;
        }
        return true;
    }
}