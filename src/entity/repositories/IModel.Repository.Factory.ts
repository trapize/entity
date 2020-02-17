import { Model } from '../Model';
import { IModelRepository } from './IModel.Repository';

/**
 *
 *
 * @export
 * @interface IModelRepositoryFactory
 */
export interface IModelRepositoryFactory {
    /**
     *
     *
     * @template FullModel
     * @template PartialModel
     * @param {typeof Model} type
     * @returns {IModelRepository<FullModel, PartialModel>}
     * @memberof IModelRepositoryFactory
     */
    Create<FullModel extends Model, PartialModel>(type: typeof Model): IModelRepository<FullModel, PartialModel>;
}