import { IModelDescribeResult } from './IModel.Describe.Result';
import { IFieldsDescribeResult } from './IFields.Describe.Result';
import { FieldsDescriberResult } from './Fields.Describe.Result';
import { IFieldDescribeResult } from './IField.Describe.Result';
import { IModel } from './IModel';
import { Relationship, DetailRelationship, DetailsRelationship, JunctionRelationship } from './Relations';
import { EntityExceptions } from './exceptions/Entity.Exception';

/**
 *
 *
 * @export
 * @class ModelDescribeResult
 * @implements {IModelDescribeResult}
 */
export class ModelDescribeResult implements IModelDescribeResult {

    /**
     *
     *
     * @type {{[column: string]: string}}
     * @memberof ModelDescribeResult
     */
    public columnsToFields: {[column: string]: string} = {};
    /**
     *
     *
     * @type {{[field: string]: string}}
     * @memberof ModelDescribeResult
     */
    public fieldsToColumns: {[field: string]: string} = {};
    /**
     *
     *
     * @type {IFieldsDescribeResult}
     * @memberof ModelDescribeResult
     */
    public fields: IFieldsDescribeResult = new FieldsDescriberResult();
    /**
     *
     *
     * @type {string}
     * @memberof ModelDescribeResult
     */
    public alias: string;
    /**
     *
     *
     * @type {string}
     * @memberof ModelDescribeResult
     */
    public table: string;
    /**
     *
     *
     * @type {string}
     * @memberof ModelDescribeResult
     */
    public plural: string;
    /**
     *
     *
     * @type {string}
     * @memberof ModelDescribeResult
     */
    public schema: string;
    /**
     *
     *
     * @private
     * @type {IFieldDescribeResult}
     * @memberof ModelDescribeResult
     */
    private id?: IFieldDescribeResult;
    /**
     *
     *
     * @private
     * @type {{[property: string]: Relationship}}
     * @memberof ModelDescribeResult
     */
    private relationships: {[property: string]: Relationship} = {};

    /**
     *Creates an instance of ModelDescribeResult.
     * @memberof ModelDescribeResult
     */
    public constructor() {}

    /**
     *
     *
     * @type {IFieldDescribeResult}
     * @memberof ModelDescribeResult
     */
    public get Id(): IFieldDescribeResult {
        if(!this.id) {
            throw new EntityExceptions.InvalidAccessorException(`Unregistered Id field on type [${this.schema}.${this.table}]`);
        }
        return this.id;
    }

    /**
     *
     *
     * @memberof ModelDescribeResult
     */
    public set Id(value: IFieldDescribeResult) {
        this.id = value;
    }

    /**
     *
     *
     * @readonly
     * @type {boolean}
     * @memberof ModelDescribeResult
     */
    public get HasId(): boolean {
        return this.id ? true : false;
    }

    /**
     *
     *
     * @returns {Relationship[]}
     * @memberof ModelDescribeResult
     */
    public getRelationships(): Relationship[] {
        return Object.values(this.relationships);
    }

    /**
     *
     *
     * @returns {DetailRelationship[]}
     * @memberof ModelDescribeResult
     */
    public getDetailRelationships(): DetailRelationship[] {
        return <DetailRelationship[]>this.getRelationships().filter(r => r instanceof DetailRelationship);
    }

    /**
     *
     *
     * @returns {DetailsRelationship[]}
     * @memberof ModelDescribeResult
     */
    public getDetailsRelationships(): DetailsRelationship[] {
        return <DetailsRelationship[]>this.getRelationships().filter(r => r instanceof DetailsRelationship);
    }

    /**
     *
     *
     * @returns {JunctionRelationship[]}
     * @memberof ModelDescribeResult
     */
    public getJunctionRelationships(): JunctionRelationship[] {
        return <JunctionRelationship[]>this.getRelationships().filter(r => r instanceof JunctionRelationship);
    }

    /**
     *
     *
     * @param {string} property
     * @param {Relationship} relationship
     * @memberof ModelDescribeResult
     */
    public setRelationship(property: string, relationship: Relationship): void {
        this.relationships[property] = relationship;
    }

    /**
     *
     *
     * @param {string} property
     * @returns {Relationship}
     * @memberof ModelDescribeResult
     */
    public getRelationship(property: string): Relationship {
        if(!this.relationships[property]) {
            throw new EntityExceptions.InvalidRelationshipException('Unknown relationship');
        }
        return this.relationships[property];
    }

    /**
     *
     *
     * @param {string} field
     * @returns {string}
     * @memberof ModelDescribeResult
     */
    public getColumnName(field: string): string {
        const name: string | undefined = this.fieldsToColumns[field] || (this.columnsToFields[field] ? field : undefined);
        if(!name) {
            throw new EntityExceptions.InvalidAccessorException('Unknown Column: ' + field);
        }
        return name;
    }

    /**
     *
     *
     * @param {string} column
     * @returns {IFieldDescribeResult}
     * @memberof ModelDescribeResult
     */
    public getField(column: string): IFieldDescribeResult {
        return this.fields[this.getFieldName(column)];
    }

    /**
     *
     *
     * @param {string} column
     * @returns {string}
     * @memberof ModelDescribeResult
     */
    public getFieldName(column: string): string {
        const name: string | undefined = this.columnsToFields[column] || (this.fieldsToColumns[column] ? column : undefined);
        if(!name) {
            throw new EntityExceptions.InvalidAccessorException('Unknown Field: ' + column);
        }
        return name;
    }

    /**
     *
     *
     * @param {string} field
     * @returns {boolean}
     * @memberof ModelDescribeResult
     */
    public getIsField(field: string): boolean {
        if(this.fieldsToColumns[field]) {
            return true;
        }
        return false;
    }

    /**
     *
     *
     * @param {string} column
     * @returns {boolean}
     * @memberof ModelDescribeResult
     */
    public getIsColumn(column: string): boolean {
        if(this.columnsToFields[column]) {
            return true;
        }
        return false;
    }

    /**
     *
     *
     * @param {string} columnOrField
     * @returns {boolean}
     * @memberof ModelDescribeResult
     */
    public getIsColumnOrField(columnOrField: string): boolean {
        return this.getIsField(columnOrField) || this.getIsColumn(columnOrField);
    }

    /**
     *
     *
     * @returns {string}
     * @memberof ModelDescribeResult
     */
    public toSql(): string {
        return `${this.schema}.${this.table} ${this.alias}`;
    }

    /**
     *
     *
     * @returns {IFieldDescribeResult[]}
     * @memberof ModelDescribeResult
     */
    public getFields(): IFieldDescribeResult[] {
        return Object.getOwnPropertyNames(this.fields).map(field => this.fields[field])
    }

    /**
     *
     *
     * @returns {string[]}
     * @memberof ModelDescribeResult
     */
    public getAliasedColumns(): string[] {
        return this.getFields().map(field => field.getAliasedColumn(this.alias));
    }

    /**
     *
     *
     * @returns {(IFieldDescribeResult | undefined)}
     * @memberof ModelDescribeResult
     */
    public getAutoField(): IFieldDescribeResult | undefined {
        return this.getFields().find(field => field.isAutoIncrement);
    }

    /**
     *
     *
     * @returns {IFieldDescribeResult[]}
     * @memberof ModelDescribeResult
     */
    public getPrimaryKeys(): IFieldDescribeResult[] {
        return this.getFields().filter(field => field.isPrimaryKey).sort((a, b) => a.CompareTo(b));
    }

    /**
     *
     *
     * @param {IModel} model
     * @returns {IFieldDescribeResult[]}
     * @memberof ModelDescribeResult
     */
    public getUpdatable(model: IModel): IFieldDescribeResult[] {
        return this.getFields().filter(field => field.getIsUpdateable(model));
    }

    /**
     *
     *
     * @param {IModel} model
     * @returns {IFieldDescribeResult[]}
     * @memberof ModelDescribeResult
     */
    public getInsertable(model: IModel): IFieldDescribeResult[] {
        return this.getFields().filter(field => field.getIsInsertable(model));
    }
}