import { injectable, inject } from 'inversify';
import { IModelServiceFactory } from './IModel.Service.Factory';
import { EntitySymbols } from '../Symbols';
import { IModelRepositoryFactory } from '../repositories/IModel.Repository.Factory';
import { Model } from '../Model';
import { IModelService } from './IModel.Service';
import { ModelService } from './Model.Service';

/**
 *
 *
 * @export
 * @class ModelServiceFactory
 * @implements {IModelServiceFactory}
 */
@injectable()
export class ModelServiceFactory implements IModelServiceFactory {
    /**
     *Creates an instance of ModelServiceFactory.
     * @param {IModelRepositoryFactory} repoFactory
     * @memberof ModelServiceFactory
     */
    public constructor(
        @inject(EntitySymbols.IModelRepositoryFactory) private repoFactory: IModelRepositoryFactory
    ) {}

    /**
     *
     *
     * @template FullModel
     * @template PartialModel
     * @param {typeof Model} type
     * @returns {IModelService<FullModel, PartialModel>}
     * @memberof ModelServiceFactory
     */
    public Create<FullModel extends Model, PartialModel>(type: typeof Model): IModelService<FullModel, PartialModel> {
        return new ModelService(this.repoFactory.Create(type));
    }
}