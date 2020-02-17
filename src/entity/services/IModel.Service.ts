import { Model } from '../Model';
import { IQueryFilter, IQueryFilterable } from '../query-builder';
import { Observable } from 'rxjs';
import { IPrimaryKeyQuery } from '../query-builder/IPrimary.Key.Query';

/**
 *
 *
 * @export
 * @interface IModelService
 * @template FullModel
 * @template PartialModel
 */
export interface IModelService<FullModel extends Model, PartialModel> {
    /**
     *
     *
     * @param {IQueryFilter} [queryFilter]
     * @returns {Observable<FullModel[]>}
     * @memberof IModelService
     */
    Find(queryFilter?: IQueryFilter): Observable<FullModel[]>;
    /**
     *
     *
     * @param {IQueryFilter} queryFilter
     * @returns {Observable<FullModel>}
     * @memberof IModelService
     */
    FindOne(queryFilter: IQueryFilter): Observable<FullModel>;
    /**
     *
     *
     * @param {IPrimaryKeyQuery} query
     * @returns {Observable<FullModel[]>}
     * @memberof IModelService
     */
    GetByPrimaryKeys(query: IPrimaryKeyQuery): Observable<FullModel[]>;
    /**
     *
     *
     * @param {PartialModel} model
     * @returns {Observable<FullModel>}
     * @memberof IModelService
     */
    Save(model: PartialModel): Observable<FullModel>;
    /**
     *
     *
     * @param {...any[]} keyValues
     * @returns {Observable<void>}
     * @memberof IModelService
     */
    Delete(...keyValues: any[]): Observable<void>;
    /**
     *
     *
     * @param {...IQueryFilterable[]} filters
     * @returns {Observable<void>}
     * @memberof IModelService
     */
    DeleteWhere(...filters: IQueryFilterable[]): Observable<void>;
}