import { Model } from '../Model';
import { IModelService } from './IModel.Service';

/**
 *
 *
 * @export
 * @interface IModelServiceFactory
 */
export interface IModelServiceFactory {
    /**
     *
     *
     * @template FullModel
     * @template PartialModel
     * @param {typeof Model} type
     * @returns {IModelService<FullModel, PartialModel>}
     * @memberof IModelServiceFactory
     */
    Create<FullModel extends Model, PartialModel>(type: typeof Model): IModelService<FullModel, PartialModel>;
}