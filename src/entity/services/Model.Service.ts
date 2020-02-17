import { IModelService } from './IModel.Service';
import { Model } from '../Model';
import { IModelRepository } from '../repositories/IModel.Repository';
import { IQueryFilter, IQueryFilterable } from '../query-builder';
import { Observable } from 'rxjs';
import { IPrimaryKeyQuery } from '../query-builder/IPrimary.Key.Query';

/**
 *
 *
 * @export
 * @class ModelService
 * @implements {IModelService<FullModel, PartialModel>}
 * @template FullModel
 * @template PartialModel
 */
export class ModelService<FullModel extends Model, PartialModel> implements IModelService<FullModel, PartialModel> {
    /**
     *Creates an instance of ModelService.
     * @param {IModelRepository<FullModel, PartialModel>} repo
     * @memberof ModelService
     */
    public constructor(
        private repo: IModelRepository<FullModel, PartialModel>
    ) {}

    /**
     *
     *
     * @param {IQueryFilter} [queryFilter]
     * @returns {Observable<FullModel[]>}
     * @memberof ModelService
     */
    public Find(queryFilter?: IQueryFilter): Observable<FullModel[]> {
        return this.repo.Find(queryFilter);
    }

    /**
     *
     *
     * @param {IQueryFilter} queryFilter
     * @returns {Observable<FullModel>}
     * @memberof ModelService
     */
    public FindOne(queryFilter: IQueryFilter): Observable<FullModel> {
        return this.repo.FindOne(queryFilter);
    }

    /**
     *
     *
     * @param {IPrimaryKeyQuery} query
     * @returns {Observable<FullModel[]>}
     * @memberof ModelService
     */
    public GetByPrimaryKeys(query: IPrimaryKeyQuery): Observable<FullModel[]> {
        return this.repo.GetByPrimaryKeys(query);
    }

    /**
     *
     *
     * @param {PartialModel} model
     * @returns {Observable<FullModel>}
     * @memberof ModelService
     */
    public Save(model: PartialModel): Observable<FullModel> {
        return this.repo.Save(model);
    }

    /**
     *
     *
     * @param {...any[]} keyValues
     * @returns {Observable<void>}
     * @memberof ModelService
     */
    public Delete(...keyValues: any[]): Observable<void> {
        return this.repo.Delete(...keyValues);
    }

    /**
     *
     *
     * @param {...IQueryFilterable[]} filters
     * @returns {Observable<void>}
     * @memberof ModelService
     */
    public DeleteWhere(...filters: IQueryFilterable[]): Observable<void> {
        return this.repo.DeleteWhere(...filters);
    }

}