import { IQueryFilterable } from './Filters';
import { OrderBy } from './types';

/**
 *
 *
 * @export
 * @interface IQueryFilter
 */
export interface IQueryFilter {
    /**
     *
     *
     * @type {IQueryFilterable[]}
     * @memberof IQueryFilter
     */
    filters?: IQueryFilterable[],
    /**
     *
     *
     * @type {(string | string[])}
     * @memberof IQueryFilter
     */
    include?: string | string[],
    /**
     *
     *
     * @type {OrderBy[]}
     * @memberof IQueryFilter
     */
    orderBy?: OrderBy[],
    /**
     *
     *
     * @type {number}
     * @memberof IQueryFilter
     */
    limit?: number,
    /**
     *
     *
     * @type {number}
     * @memberof IQueryFilter
     */
    offset?: number
}