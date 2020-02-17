import { Model } from '../Model';
import { IQueryFilterable } from './Filters';
import { Observable } from 'rxjs';
import { IDetailRelationship, IDetailsRelationship, IJunctionRelationship } from '../IRelations';
import { IConnection } from '@trapize/connections';
import { OrderBy } from './types';

export type IQueryBuilderConstructor = new (connection: IConnection) => IQueryBuilder;


/**
 *
 *
 * @export
 * @interface IQueryBuilder
 */
export interface IQueryBuilder {
    /**
     *
     *
     * @param {...(typeof Model)[]} types
     * @returns {this}
     * @memberof IQueryBuilder
     */
    Select(...types: (typeof Model)[]): this;
    /**
     *
     *
     * @param {...(typeof Model)[]} types
     * @returns {this}
     * @memberof IQueryBuilder
     */
    From(...types: (typeof Model)[]): this;
    /**
     *
     *
     * @param {(...(IDetailRelationship|IDetailsRelationship)[])} joins
     * @returns {this}
     * @memberof IQueryBuilder
     */
    InnerJoin(...joins: (IDetailRelationship|IDetailsRelationship)[]): this;
    /**
     *
     *
     * @param {...IDetailRelationship[]} joins
     * @returns {this}
     * @memberof IQueryBuilder
     */
    OuterJoin(...joins: IDetailRelationship[]): this;
    /**
     *
     *
     * @param {...IJunctionRelationship[]} joins
     * @returns {this}
     * @memberof IQueryBuilder
     */
    JunctionJoinMaster(...joins: IJunctionRelationship[]): this;
    /**
     *
     *
     * @param {...IJunctionRelationship[]} joins
     * @returns {this}
     * @memberof IQueryBuilder
     */
    JunctionJoinDetail(...joins: IJunctionRelationship[]): this;
    /**
     *
     *
     * @param {...IQueryFilterable[]} filters
     * @returns {this}
     * @memberof IQueryBuilder
     */
    Where(...filters: IQueryFilterable[]): this;
    /**
     *
     *
     * @param {number} [limit]
     * @param {number} [offset]
     * @returns {this}
     * @memberof IQueryBuilder
     */
    Limit(limit?: number, offset?: number): this;
    /**
     *
     *
     * @param {...OrderBy[]} orderBy
     * @returns {this}
     * @memberof IQueryBuilder
     */
    OrderBy(...orderBy: OrderBy[]): this;
    /**
     *
     *
     * @returns {string}
     * @memberof IQueryBuilder
     */
    ToSql(): string;
    /**
     *
     *
     * @template T
     * @returns {Observable<T[]>}
     * @memberof IQueryBuilder
     */
    Execute<T = any>(): Observable<T[]>;
}