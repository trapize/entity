import { IFieldsDescribeResult } from './IFields.Describe.Result';
import { IFieldDescribeResult } from './IField.Describe.Result';
import { IModel } from './IModel';
import { Relationship, DetailRelationship, DetailsRelationship, JunctionRelationship } from './Relations';

/**
 *
 *
 * @export
 * @interface IModelDescribeResult
 */
export interface IModelDescribeResult {
    /**
     *
     *
     * @type {{[column: string]: string}}
     * @memberof IModelDescribeResult
     */
    columnsToFields: {[column: string]: string};
    /**
     *
     *
     * @type {{[field: string]: string}}
     * @memberof IModelDescribeResult
     */
    fieldsToColumns: {[field: string]: string};
    /**
     *
     *
     * @type {IFieldsDescribeResult}
     * @memberof IModelDescribeResult
     */
    fields: IFieldsDescribeResult;
    /**
     *
     *
     * @type {string}
     * @memberof IModelDescribeResult
     */
    alias: string;
    /**
     *
     *
     * @type {string}
     * @memberof IModelDescribeResult
     */
    table: string;
    /**
     *
     *
     * @type {string}
     * @memberof IModelDescribeResult
     */
    plural: string;
    /**
     *
     *
     * @type {string}
     * @memberof IModelDescribeResult
     */
    schema: string;
    /**
     *
     *
     * @type {IFieldDescribeResult}
     * @memberof IModelDescribeResult
     */
    Id: IFieldDescribeResult;
    /**
     *
     *
     * @type {boolean}
     * @memberof IModelDescribeResult
     */
    readonly HasId: boolean;
    /**
     *
     *
     * @param {string} property
     * @param {Relationship} relationship
     * @memberof IModelDescribeResult
     */
    setRelationship(property: string, relationship: Relationship): void;
    /**
     *
     *
     * @param {string} property
     * @returns {Relationship}
     * @memberof IModelDescribeResult
     */
    getRelationship(property: string): Relationship;
    /**
     *
     *
     * @returns {Relationship[]}
     * @memberof IModelDescribeResult
     */
    getRelationships(): Relationship[];
    /**
     *
     *
     * @returns {DetailRelationship[]}
     * @memberof IModelDescribeResult
     */
    getDetailRelationships(): DetailRelationship[];
    /**
     *
     *
     * @returns {DetailsRelationship[]}
     * @memberof IModelDescribeResult
     */
    getDetailsRelationships(): DetailsRelationship[];
    /**
     *
     *
     * @returns {JunctionRelationship[]}
     * @memberof IModelDescribeResult
     */
    getJunctionRelationships(): JunctionRelationship[];
    /**
     *
     *
     * @returns {string}
     * @memberof IModelDescribeResult
     */
    toSql(): string;
    /**
     *
     *
     * @param {string} field
     * @returns {string}
     * @memberof IModelDescribeResult
     */
    getColumnName(field: string): string;
    /**
     *
     *
     * @param {string} column
     * @returns {IFieldDescribeResult}
     * @memberof IModelDescribeResult
     */
    getField(column: string): IFieldDescribeResult;
    /**
     *
     *
     * @param {string} column
     * @returns {string}
     * @memberof IModelDescribeResult
     */
    getFieldName(column: string): string;
    /**
     *
     *
     * @returns {IFieldDescribeResult[]}
     * @memberof IModelDescribeResult
     */
    getPrimaryKeys(): IFieldDescribeResult[];
    /**
     *
     *
     * @returns {IFieldDescribeResult[]}
     * @memberof IModelDescribeResult
     */
    getFields(): IFieldDescribeResult[];
    /**
     *
     *
     * @param {IModel} model
     * @returns {IFieldDescribeResult[]}
     * @memberof IModelDescribeResult
     */
    getUpdatable(model: IModel): IFieldDescribeResult[];
    /**
     *
     *
     * @param {IModel} model
     * @returns {IFieldDescribeResult[]}
     * @memberof IModelDescribeResult
     */
    getInsertable(model: IModel): IFieldDescribeResult[];
    /**
     *
     *
     * @returns {(IFieldDescribeResult | undefined)}
     * @memberof IModelDescribeResult
     */
    getAutoField(): IFieldDescribeResult | undefined;
    /**
     *
     *
     * @param {string} columnOrField
     * @returns {boolean}
     * @memberof IModelDescribeResult
     */
    getIsField(columnOrField: string): boolean;
    /**
     *
     *
     * @param {string} columnOrField
     * @returns {boolean}
     * @memberof IModelDescribeResult
     */
    getIsColumn(columnOrField: string): boolean;
    /**
     *
     *
     * @param {string} columnOrField
     * @returns {boolean}
     * @memberof IModelDescribeResult
     */
    getIsColumnOrField(columnOrField: string): boolean;
    /**
     *
     *
     * @returns {string[]}
     * @memberof IModelDescribeResult
     */
    getAliasedColumns(): string[];
}