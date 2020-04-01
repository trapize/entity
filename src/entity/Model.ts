import _ from 'lodash';
import { ModelOptions } from './Model.Options';
import { IModelDescribeResult } from './IModel.Describe.Result';
import { RemoveUndefines } from '@trapize/core';
import { IFieldDescribeResult } from './IField.Describe.Result';
import { ModelJSON } from './types';

/**
 *
 *
 * @interface ModelConstructor
 * @template T
 */
interface ModelConstructor<T extends Model> {
    new (): T;
    new (values: {[key: string]: any}): T;
    new (values: {[key: string]: any}, options: ModelOptions): T;
}

/**
 *
 *
 * @export
 * @abstract
 * @class Model
 */
export abstract class Model {

    /**
     *
     *
     * @static
     * @type {symbol}
     * @memberof Model
     */
    public static readonly MetadataKey: symbol = Symbol('Model Metadata Key, Core.Entity');

    /**
     *
     *
     * @readonly
     * @static
     * @type {IFieldDescribeResult}
     * @memberof Model
     */
    public static get Id(): IFieldDescribeResult {
        return this.Describe.Id;
    }
    
    /**
     *
     *
     * @readonly
     * @static
     * @type {IModelDescribeResult}
     * @memberof Model
     */
    public static get Describe(): IModelDescribeResult {
        return Reflect.getOwnMetadata(Model.MetadataKey, this);
    }

    private _values: {[key: string]: any} = {};
    /**
     *
     *
     * @private
     * @type {{[key: string]: any}}
     * @memberof Model
     */
    private _previous: {[key: string]: any} = {};
    /**
     *
     *
     * @private
     * @type {boolean}
     * @memberof Model
     */
    private _isModified: boolean = false;
    /**
     *
     *
     * @private
     * @type {boolean}
     * @memberof Model
     */
    private _isNew: boolean = true;

    /**
     *Creates an instance of Model.
     * @param {{[key: string]: any}} [values={}]
     * @param {ModelOptions} [options={}]
     * @memberof Model
     */
    public constructor(values: {[key: string]: any} = {}, options: ModelOptions = {}) {
        const describe = <IModelDescribeResult>Reflect.getOwnMetadata(Model.MetadataKey, this.Constructor);
        this._values = {};
        this._previous = {};
        describe.getFields().forEach(field => {
            this._values[field.field] = values[field.field] || (field.defaultValue && !options.ignoreDefaults ? field.defaultValue : undefined);
            this._previous[field.field] = values[field.field] || (field.defaultValue && !options.ignoreDefaults ? field.defaultValue : undefined);
        });
        this._isNew = options.isNew === undefined ? true : options.isNew;
    }

    /**
     *
     *
     * @readonly
     * @type {boolean}
     * @memberof Model
     */
    public get IsModified(): boolean {
        return this._isModified;
    }

    /**
     *
     *
     * @readonly
     * @type {boolean}
     * @memberof Model
     */
    public get IsNew(): boolean {
        return this._isNew;
    }

    /**
     *
     *
     * @readonly
     * @type {typeof Model}
     * @memberof Model
     */
    public get Type(): typeof Model {
        return Object.getPrototypeOf(this).constructor;
    }

    /**
     *
     *
     * @readonly
     * @type {ModelConstructor<this>}
     * @memberof Model
     */
    public get Constructor(): ModelConstructor<this> {
        return <ModelConstructor<this>>Object.getPrototypeOf(this).constructor;
    }

    /**
     *
     *
     * @readonly
     * @type {Function}
     * @memberof Model
     */
    public get Function(): Function {
        return Object.getPrototypeOf(this).constructor;
    }

    /**
     *
     *
     * @param {string} key
     * @param {*} value
     * @memberof Model
     */
    public Set(key: string, value: any): void {
        if(this.Type.Describe.getIsField(key)) {
            this._values[key] = value;
            this._isModified = this._isModified || this._values[key] !== this._previous[key];
        } else {
            (<any>this)[key] = value;
        }
    }

    /**
     *
     *
     * @template T
     * @param {string} key
     * @returns {T}
     * @memberof Model
     */
    public Get<T = any>(key: string): T {
        if(this.Type.Describe.getIsField(key)) {
            return this._values[key];
        } else {
            return (<any>this)[key];
        }
    }

    /**
     *
     *
     * @template T
     * @param {string} key
     * @returns {T}
     * @memberof Model
     */
    public GetPrevious<T = any>(key: string): T {
        return this._previous[key];
    }
    
    /**
     *
     *
     * @param {string} key
     * @returns {boolean}
     * @memberof Model
     */
    public GetIsChanged(key: string): boolean {
        return this.Get(key) !== this.GetPrevious(key);
    }

    /**
     *
     *
     * @returns {ModelJSON}
     * @memberof Model
     */
    public ToJSON(): ModelJSON {
        const describe = this.Type.Describe;
        const calculated = Object.getOwnPropertyNames(describe.fields).reduce((obj: any, field: string) => {
            if(describe.fields[field].isCalculated) {
                const value = (<any>this)[field];
                obj = {
                    [field]: value,
                    ...obj
                }
            }
            
            return obj;
        }, {});

        const values = Object.getOwnPropertyNames(this._values).filter(field => describe.getIsField(field)).reduce((vals: any, field: string) => {
            return{
                ...vals,
                [field]: this._values[field]
            }
        }, {});

        // Remove Id Fields
        describe.getPrimaryKeys().forEach(pk => {
            delete values[pk.field];
            delete calculated[pk.field];
        });

        const relationships = describe.getRelationships().reduce((obj: any, relation: any) => {
            const val = this.Get(relation.key);
            return {
                ...obj,
                [relation.key]: val ? Array.isArray(val) ? val.filter(v => v instanceof Model).map(v => v.ToJSON()) : val instanceof Model ? val.ToJSON() : undefined : undefined
            };
        }, {});
        
        const returnType = {
            type: this.Constructor.name,
            id: describe.HasId ? this.Get(describe.Id.field) : describe.getPrimaryKeys().reduce((obj: any, pk: IFieldDescribeResult) => ({
                ...obj,
                [pk.field]: this.Get(pk.field)
            }), {}),
            attributes: {
                ...values,
                ...calculated
            },
            includes: Object.getOwnPropertyNames(relationships).length ? relationships : undefined
        }

        return RemoveUndefines(returnType);
    }
}
