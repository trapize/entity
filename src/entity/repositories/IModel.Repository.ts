import { IQueryFilter, IQueryFilterable } from '../query-builder';
import { Observable } from 'rxjs';
import { Model } from '../Model';
import { IPrimaryKeyQuery } from '../query-builder/IPrimary.Key.Query';

/**
 *
 *
 * @export
 * @interface IModelRepository
 * @template FullModel
 * @template PartialModel
 */
export interface IModelRepository<FullModel extends Model, PartialModel> {
    /**
     *
     *
     * @param {IQueryFilter} [queryFilter]
     * @returns {Observable<FullModel[]>}
     * @memberof IModelRepository
     */
    Find(queryFilter?: IQueryFilter): Observable<FullModel[]>;
    /**
     *
     *
     * @param {IQueryFilter} queryFilter
     * @returns {Observable<FullModel>}
     * @memberof IModelRepository
     */
    FindOne(queryFilter: IQueryFilter): Observable<FullModel>;
    /**
     *
     *
     * @param {IPrimaryKeyQuery} query
     * @returns {Observable<FullModel[]>}
     * @memberof IModelRepository
     */
    GetByPrimaryKeys(query: IPrimaryKeyQuery): Observable<FullModel[]>;
    /**
     *
     *
     * @param {PartialModel} model
     * @returns {Observable<FullModel>}
     * @memberof IModelRepository
     */
    Save(model: PartialModel): Observable<FullModel>;
    /**
     *
     *
     * @param {...any[]} keyValues
     * @returns {Observable<void>}
     * @memberof IModelRepository
     */
    Delete(...keyValues: any[]): Observable<void>;
    /**
     *
     *
     * @param {...IQueryFilterable[]} filters
     * @returns {Observable<void>}
     * @memberof IModelRepository
     */
    DeleteWhere(...filters: IQueryFilterable[]): Observable<void>;
}