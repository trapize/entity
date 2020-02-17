import { injectable, inject } from 'inversify';
import { IModelRepositoryFactory } from './IModel.Repository.Factory';
import { EntitySymbols } from '../Symbols';
import { ISchema } from '../ISchema';
import { IModelRepository } from './IModel.Repository';
import { Model } from '../Model';
import { ModelRepository } from './Model.Repository';

/**
 *
 *
 * @export
 * @class ModelRepositoryFactory
 * @implements {IModelRepositoryFactory}
 */
@injectable()
export class ModelRepositoryFactory implements IModelRepositoryFactory {
    /**
     *Creates an instance of ModelRepositoryFactory.
     * @param {ISchema} schema
     * @memberof ModelRepositoryFactory
     */
    public constructor(
        @inject(EntitySymbols.ISchema) private schema: ISchema
    ) {}

    /**
     *
     *
     * @template FullModel
     * @template PartialModel
     * @param {typeof Model} type
     * @returns {IModelRepository<FullModel, PartialModel>}
     * @memberof ModelRepositoryFactory
     */
    public Create<FullModel extends Model, PartialModel>(type: typeof Model): IModelRepository<FullModel, PartialModel> {
        return new ModelRepository(type, this.schema);
    }
}