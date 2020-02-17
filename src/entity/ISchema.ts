import { Model } from './Model';
import { IQueryFilter } from './query-builder/IQuery.Filter';
import { Observable } from 'rxjs';
import { IQueryFilterable } from './query-builder';

/**
 *
 *
 * @export
 * @interface ISchema
 */
export interface ISchema {
    /**
     *
     *
     * @template T
     * @param {typeof Model} type
     * @param {IQueryFilter} [filter]
     * @returns {Observable<T[]>}
     * @memberof ISchema
     */
    Find<T extends Model = Model>(type: typeof Model, filter?: IQueryFilter): Observable<T[]>;
    /**
     *
     *
     * @template T
     * @param {typeof Model} type
     * @param {IQueryFilter} [filter]
     * @returns {Observable<T>}
     * @memberof ISchema
     */
    FindOne<T extends Model>(type: typeof Model, filter?: IQueryFilter): Observable<T>;
    /**
     *
     *
     * @template T
     * @param {T} model
     * @returns {Observable<T>}
     * @memberof ISchema
     */
    Save<T extends Model>(model: T): Observable<T>;
    /**
     *
     *
     * @template T
     * @param {T} model
     * @returns {Observable<void>}
     * @memberof ISchema
     */
    Delete<T extends Model>(model: T): Observable<void>;
    /**
     *
     *
     * @param {typeof Model} type
     * @param {...IQueryFilterable[]} filter
     * @returns {Observable<void>}
     * @memberof ISchema
     */
    DeleteWhere(type: typeof Model, ...filter: IQueryFilterable[]): Observable<void>;
}