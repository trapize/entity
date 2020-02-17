import { IConnection } from '@trapize/connections';
import { IQueryFilterable, GetFilterAndInputs, FIELD } from './Filters';
import { Model } from '../Model';
import { Observable, from } from 'rxjs';
import { DetailRelationship, DetailsRelationship, JunctionRelationship } from '../Relations';
import { Operators } from './Query.Operators';
import { IQueryBuilder } from './IQuery.Builder';
import { OrderBy } from './types';
import { EntityExceptions } from '../exceptions/Entity.Exception';

/**
 *
 *
 * @export
 * @class QueryBuilder
 * @implements {IQueryBuilder}
 */
export class QueryBuilder implements IQueryBuilder {
    /**
     *
     *
     * @private
     * @type {IQueryFilterable[]}
     * @memberof QueryBuilder
     */
    private filters: IQueryFilterable[] = [];
    /**
     *
     *
     * @private
     * @type {Set<typeof Model>}
     * @memberof QueryBuilder
     */
    private select: Set<typeof Model> = new Set<typeof Model>();
    /**
     *
     *
     * @private
     * @type {Set<typeof Model>}
     * @memberof QueryBuilder
     */
    private from: Set<typeof Model> = new Set<typeof Model>();
    /**
     *
     *
     * @private
     * @type {OrderBy[]}
     * @memberof QueryBuilder
     */
    private orderBy: OrderBy[] = [];
    /**
     *
     *
     * @private
     * @type {number}
     * @memberof QueryBuilder
     */
    private limit?: number;
    /**
     *
     *
     * @private
     * @type {number}
     * @memberof QueryBuilder
     */
    private offset?: number;
    /**
     *
     *
     * @private
     * @type {[string, any[]]}
     * @memberof QueryBuilder
     */
    private _filterResults: [string, any[]];
    /**
     *
     *
     * @private
     * @type {DetailRelationship[]}
     * @memberof QueryBuilder
     */
    private outerJoins: DetailRelationship[] = [];

    /**
     *Creates an instance of QueryBuilder.
     * @param {IConnection} connection
     * @memberof QueryBuilder
     */
    public constructor(private connection: IConnection) {}

    /**
     *
     *
     * @readonly
     * @private
     * @type {[string, any[]]}
     * @memberof QueryBuilder
     */
    private get FilterResults(): [string, any[]] {
        if(!this._filterResults) {
            this._filterResults = GetFilterAndInputs(this.filters);
        }
        return this._filterResults;
    }

    /**
     *
     *
     * @param {...(typeof Model)[]} types
     * @returns {this}
     * @memberof QueryBuilder
     */
    public Select(...types: (typeof Model)[]): this {
        types.forEach(type => this.select.add(type));
        return this;
    }

    /**
     *
     *
     * @param {...(typeof Model)[]} types
     * @returns {this}
     * @memberof QueryBuilder
     */
    public From(...types: (typeof Model)[]): this {
        types.forEach(type => this.from.add(type));
        return this;
    }

    /**
     *
     *
     * @param {...JunctionRelationship[]} joins
     * @returns {this}
     * @memberof QueryBuilder
     */
    public JunctionJoinMaster(...joins: JunctionRelationship[]): this {
        joins.forEach(join => {
            this.From(join.junction, join.master);
            this.Where(...join.masterJoins.map(j => FIELD(j.left, Operators.Eq, j.right)));
        });
        return this;
    }

    /**
     *
     *
     * @param {...JunctionRelationship[]} joins
     * @returns {this}
     * @memberof QueryBuilder
     */
    public JunctionJoinDetail(...joins: JunctionRelationship[]): this {
        joins.forEach(join => {
            this.From(join.junction, join.detail);
            this.Where(...join.detailJoins.map(j => FIELD(j.left, Operators.Eq, j.right)));
        });
        return this;
    }

    /**
     *
     *
     * @param {(...(DetailRelationship|DetailsRelationship)[])} joins
     * @returns {this}
     * @memberof QueryBuilder
     */
    public InnerJoin(...joins: (DetailRelationship|DetailsRelationship)[]): this {
        joins.forEach(join => {
            this.Select(join.detail);
            this.From(join.master, join.detail);
            this.Where(...join.joins.map(j => FIELD(j.left, Operators.Eq, j.right)));
        });
        return this;
    }

    /**
     *
     *
     * @param {...DetailRelationship[]} joins
     * @returns {this}
     * @memberof QueryBuilder
     */
    public OuterJoin(...joins: DetailRelationship[]): this {
        joins.forEach(join => this.Select(join.master, join.detail));
        this.outerJoins = [...this.outerJoins, ...joins];
        return this;
    }

    /**
     *
     *
     * @param {...IQueryFilterable[]} filters
     * @returns {this}
     * @memberof QueryBuilder
     */
    public Where(...filters: IQueryFilterable[]): this {
        this.filters = this.filters.concat(filters);
        return this;
    }

    /**
     *
     *
     * @param {number} [limit]
     * @param {number} [offset]
     * @returns {this}
     * @memberof QueryBuilder
     */
    public Limit(limit?: number, offset?: number): this {
        this.limit = limit;
        this.offset = offset; 
        return this;
    }

    /**
     *
     *
     * @param {...OrderBy[]} orderBy
     * @returns {this}
     * @memberof QueryBuilder
     */
    public OrderBy(...orderBy: OrderBy[]): this {
        this.orderBy = this.orderBy.concat(orderBy);
        return this;
    }

    /**
     *
     *
     * @returns {string}
     * @memberof QueryBuilder
     */
    public GetSelect(): string {
        const select = Array.from(this.select);
        if(select.length === 0) {
            throw new EntityExceptions.InvalidQueryException('No Fields Selected');
        }
        return 'SELECT ' + RemoveDuplicateColumns(select.map(s => s.Describe.getAliasedColumns()).reduce((ary: string[], columns: string[]) => [...ary, ...columns], [])).join(', ');
    }

    /**
     *
     *
     * @returns {string}
     * @memberof QueryBuilder
     */
    public GetFrom(): string {
        const froms = Array.from(this.from);
        if(froms.length === 0) {
            throw new EntityExceptions.InvalidQueryException('No tables queried');
        }
        return 'FROM ' + froms.map(f => f.Describe.toSql()).join(', ') + (this.outerJoins.length ? ' ' + this.outerJoins.map(oj => `OUTER JOIN ${oj.detail.Describe.toSql()} ON ${oj.getJoinArray().join(' AND ')}`) : '');
    }

    /**
     *
     *
     * @returns {string}
     * @memberof QueryBuilder
     */
    public GetWhere(): string {
        const filters = this.FilterResults[0];
        return filters ? 'WHERE ' + filters : '';
    }

    /**
     *
     *
     * @returns {string}
     * @memberof QueryBuilder
     */
    public GetOrderBy(): string {
        return this.orderBy.length ? 'ORDER BY ' + this.orderBy.map(ob => {
            return `${ob[0].Describe.alias}.${ob[1].column}${ob.length > 2 ? ' ' + ob[2] : ''}`;
        }).join(', ') : '';
    }

    /**
     *
     *
     * @returns {string}
     * @memberof QueryBuilder
     */
    public GetLimit(): string {
        return this.limit ? `LIMIT ${this.offset ? this.offset + ', ' : ''}${this.limit}` : '';
    }

    /**
     *
     *
     * @returns {string}
     * @memberof QueryBuilder
     */
    public ToSql(): string {
        return [
            this.GetSelect(),
            this.GetFrom(),
            this.GetWhere(),
            this.GetOrderBy(),
            this.GetLimit()
        ].join(' ').replace(/\s{2,}/g, ' ').trim();
    }

    /**
     *
     *
     * @template T
     * @returns {Observable<T[]>}
     * @memberof QueryBuilder
     */
    public Execute<T = any>(): Observable<T[]> {
        return from(this.connection.query(this.ToSql(), this.FilterResults[1]));
    }

}

/**
 *
 *
 * @param {string[]} columns
 * @returns {string[]}
 */
function RemoveDuplicateColumns(columns: string[]): string[] {
    const foundColumns = new Set<string>();
    return columns.filter(aliased => {
        const column = aliased.indexOf('.') > -1 ? aliased.split(/\./)[1] : aliased;
        if(foundColumns.has(column)) {
            return false;
        }
        foundColumns.add(column);
        return true;
    });
}