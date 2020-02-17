import { Model } from './Model';
import { IModelDescribeResult } from './IModel.Describe.Result';
import { ModelDescribeResult } from './Model.Describe.Result';
import { EntityExceptions } from './exceptions/Entity.Exception';

/**
 *
 *
 * @export
 * @class Describe
 */
export class Describe {
    
    /**
     *
     *
     * @static
     * @param {Function} target
     * @returns {IModelDescribeResult}
     * @memberof Describe
     */
    public static GetDescribe(target: Function): IModelDescribeResult {
        const describe = Describe.Describes.get(target);
        if(!describe) {
            throw new EntityExceptions.InvalidEntityException(`Unrecognized Describe call: ${target}`);
        }
        return describe;
    }

    
    /**
     *
     *
     * @static
     * @param {Object} target
     * @param {(describe: IModelDescribeResult) => IModelDescribeResult} callback
     * @memberof Describe
     */
    public static UpsertDescribe(target: Object, callback: (describe: IModelDescribeResult) => IModelDescribeResult): void;
    /**
     *
     *
     * @static
     * @param {Function} target
     * @param {(describe: IModelDescribeResult) => IModelDescribeResult} callback
     * @memberof Describe
     */
    public static UpsertDescribe(target: Function, callback: (describe: IModelDescribeResult) => IModelDescribeResult): void;
    /**
     *
     *
     * @static
     * @param {(Object | Function)} target
     * @param {(describe: IModelDescribeResult) => IModelDescribeResult} callback
     * @memberof Describe
     */
    public static UpsertDescribe(target: Object | Function, callback: (describe: IModelDescribeResult) => IModelDescribeResult): void {
        Describe.SetDescribe(target, callback(Describe.GetDescribeOrCreate(target)));
    }
    
    /**
     *
     *
     * @static
     * @param {Object} target
     * @returns {IModelDescribeResult}
     * @memberof Describe
     */
    public static GetDescribeOrCreate(target: Object): IModelDescribeResult;
    /**
     *
     *
     * @static
     * @param {Function} target
     * @returns {IModelDescribeResult}
     * @memberof Describe
     */
    public static GetDescribeOrCreate(target: Function): IModelDescribeResult;
    /**
     *
     *
     * @static
     * @param {(Object | Function)} target
     * @returns {IModelDescribeResult}
     * @memberof Describe
     */
    public static GetDescribeOrCreate(target: Object | Function): IModelDescribeResult {
        return Describe.Describes.get(typeof target === 'function' ? target : target.constructor) || new ModelDescribeResult();
    }

    /**
     *
     *
     * @static
     * @param {Object} target
     * @param {IModelDescribeResult} describe
     * @memberof Describe
     */
    public static SetDescribe(target: Object, describe: IModelDescribeResult): void;
    /**
     *
     *
     * @static
     * @param {Function} target
     * @param {IModelDescribeResult} describe
     * @memberof Describe
     */
    public static SetDescribe(target: Function, describe: IModelDescribeResult): void;
    /**
     *
     *
     * @static
     * @param {(Object | Function)} target
     * @param {IModelDescribeResult} describe
     * @memberof Describe
     */
    public static SetDescribe(target: Object | Function, describe: IModelDescribeResult): void {
        Describe.Describes.set(typeof target === 'function' ? target : target.constructor, describe);
        Reflect.defineMetadata(Model.MetadataKey, describe, typeof target === 'function' ? target : target.constructor);
    }

    /* istanbul ignore next */
    /**
     *
     *
     * @static
     * @param {Function} target
     * @memberof Describe
     */
    public static ValidateDescribe(target: Function): void {
        const describe = Describe.GetDescribe(target);
        if(!describe.schema) {
            throw new EntityExceptions.EntityDefinitionException('Invalid Schema');
        }

        if(!describe.table) {
            throw new EntityExceptions.EntityDefinitionException('Invalid Table');
        }

        if(!describe.alias || describe.alias.length < 4) {
            throw new EntityExceptions.EntityDefinitionException('Invalid Alias. Table alias must be at least 4 characters long');
        }
        Describe.Describes.forEach(value => {
            if(describe === value) {
                return;
            }

            if(describe.schema === value.schema && describe.table === value.table) {
                throw new EntityExceptions.EntityDefinitionException(`Table [${describe.table}] already exists in schema [${describe.schema}]`);
            }

            if(describe.alias === value.alias) {
                throw new EntityExceptions.EntityDefinitionException(`Alias [${describe.alias}] is already in use!`);
            }
        });
    }

    /**
     *
     *
     * @static
     * @param {Object} target
     * @param {string} [message='Object does not extends Model.']
     * @memberof Describe
     */
    public static AssertExtension(target: Object, message: string = 'Object does not extends Model.'): void {
        
        if(!Model.prototype.isPrototypeOf(target)) {
            throw new EntityExceptions.EntityDefinitionException(message);
        }
    }
    
    /**
     *
     *
     * @static
     * @param {(string | symbol)} key
     * @param {string} [message='Key must be of type string']
     * @returns {key is string}
     * @memberof Describe
     */
    public static AssertPropertyKey(key: string | symbol, message: string = 'Key must be of type string'): key is string {
        
        if(typeof key === 'symbol') {
            throw new EntityExceptions.EntityDefinitionException(message);
        }
        return true;
    }

    /**
     *
     *
     * @private
     * @static
     * @type {Map<Function, IModelDescribeResult>}
     * @memberof Describe
     */
    private static Describes: Map<Function, IModelDescribeResult> = new Map<Function, IModelDescribeResult>();
}