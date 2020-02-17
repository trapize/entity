import { IQueryFilter } from './IQuery.Filter';

/**
 *
 *
 * @export
 * @interface IPrimaryKeyQuery
 * @extends {IQueryFilter}
 */
export interface IPrimaryKeyQuery extends IQueryFilter {
    /**
     *
     *
     * @type {any[]}
     * @memberof IPrimaryKeyQuery
     */
    values: any[]
}