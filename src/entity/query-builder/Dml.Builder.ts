import { injectable } from 'inversify';
import { IDmlBuilder, DmlBuildResult } from './IDml.Builder';
import { IModel } from '../IModel';
import { Describe } from '../Describe';
import { EntityExceptions } from '../exceptions/Entity.Exception';


/**
 *
 *
 * @export
 * @class DmlBuilder
 * @implements {IDmlBuilder}
 */
@injectable()
export class DmlBuilder implements IDmlBuilder {


    /**
     *
     *
     * @param {IModel} model
     * @returns {DmlBuildResult}
     * @memberof DmlBuilder
     */
    public insert(model: IModel): DmlBuildResult {
        if(!model.IsNew) {
            throw new EntityExceptions.InvalidModelException('Model is not new', model);
        }
        
        const describe = Describe.GetDescribe(model.Type);
        const insertable = describe.getInsertable(model).reduce((obj: any, field: any) => {
            return {
                ...obj,
                [field.column]: field.type.ToDatabase(model.Get(field.field))
            };
        }, {});
        return [`INSERT INTO ${describe.schema}.${describe.table} SET ?`, [insertable]];
    }    
    

    /**
     *
     *
     * @param {IModel} model
     * @returns {DmlBuildResult}
     * @memberof DmlBuilder
     */
    public update(model: IModel): DmlBuildResult {
        if(model.IsNew) {
            throw new EntityExceptions.InvalidModelException('Model is new', model);
        }
        const describe = Describe.GetDescribe(model.Type);
        const pks = describe.getPrimaryKeys().reduce((obj: any, pk: any) => {
            return {
                ...obj,
                [pk.column]: pk.type.ToDatabase(model.Get(pk.field))
            }
        }, {});
        const updateable = describe.getUpdatable(model).reduce((obj: any, field: any) => {
            if(model.GetIsChanged(field.field)) {
                obj = {
                    ...obj,
                    [field.column]: field.type.ToDatabase(model.Get(field.field))
                };
            }
            return obj;
        }, {});
        return [`UPDATE ${describe.schema}.${describe.table} SET ? WHERE ?`, [updateable, pks]];
    }
    

    /**
     *
     *
     * @param {IModel} model
     * @returns {DmlBuildResult}
     * @memberof DmlBuilder
     */
    public delete(model: IModel): DmlBuildResult {
        if(model.IsNew) {
            throw new EntityExceptions.InvalidModelException('Model is new', model);
        }
        const describe = Describe.GetDescribe(model.Type);
        const pks = describe.getPrimaryKeys().reduce((obj: any, pk: any) => {
            return {
                ...obj,
                [pk.column]: pk.type.ToDatabase(model.Get(pk.field))
            }
        }, {});
        return [`DELETE FROM ${describe.schema}.${describe.table} WHERE ?`, [pks]];
    }
    

    /**
     *
     *
     * @param {IModel} model
     * @returns {DmlBuildResult}
     * @memberof DmlBuilder
     */
    public upsert(model: IModel): DmlBuildResult {
        const describe = Describe.GetDescribe(model.Type);
        const updateable = describe.getUpdatable(model).reduce((obj: any, field: any) => ({
            ...obj,
            [field.column]: field.type.ToDatabase(model.Get(field.field))
        }), {});

        const insertable = describe.getInsertable(model).reduce((obj: any, field: any) => {
            return {
                ...obj,
                [field.column]: field.type.ToDatabase(model.Get(field.field))
            };
        }, {});

        return [`INSERT INTO ${describe.schema}.${describe.table} SET ? ON DUPLICATE KEY UPDATE ?`, [insertable, updateable]];
    }
}