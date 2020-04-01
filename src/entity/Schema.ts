import _ from 'lodash';
import { injectable, inject, optional } from 'inversify';
import { EntitySymbols } from './Symbols';
import { IConnectionFactory, IConnection, IPool, Connection } from '@trapize/connections';
import { Observable, from, of } from 'rxjs';
import { map, mergeMap, concatMap, tap, reduce } from 'rxjs/operators';
import { Model } from './Model';
import { FIELD, IQueryFilterable, GetFilterAndInputs } from './query-builder/Filters';
import { Eager } from './Load.Strategy';
import { Operators } from './query-builder/Query.Operators';
import { IQueryBuilderConstructor } from './query-builder/IQuery.Builder';
import { IQueryFilter } from './query-builder/IQuery.Filter';
import { IDmlBuilder } from './query-builder/IDml.Builder';
import { Describe } from './Describe';
import { ModelOptions } from './Model.Options';
import { QueryBuilder } from './query-builder/Query.Builder';
import { DmlBuilder } from './query-builder/Dml.Builder';
import { ISchema } from './ISchema';
import { IAppConfig, Dedupe, Core } from '@trapize/core';
import { EntityExceptions } from './exceptions/Entity.Exception';

/**
 *
 *
 * @export
 * @interface ModelConstructor
 * @template T
 */
export interface ModelConstructor<T extends Model> {
    new (): T;
    new (values: {[key: string]: any}): T;
    new (values: {[key: string]: any}, options: ModelOptions): T;
}

/**
 *
 *
 * @export
 * @class Schema
 * @implements {ISchema}
 */
@injectable()
export class Schema implements ISchema {

    /**
     *
     *
     * @static
     * @template T
     * @param {typeof Model} type
     * @param {{[key: string]: any}} [values]
     * @param {ModelOptions} [options]
     * @returns {T}
     * @memberof Schema
     */
    public static Create<T extends Model = Model>(type: typeof Model, values?: {[key: string]: any}, options?: ModelOptions): T {
        return this.NewInstance<T>(type, values, {
            ...options,
            isNew: true,
            isFromDatabase: false
        });
    }

    /**
     *
     *
     * @static
     * @template T
     * @param {typeof Model} type
     * @param {{[key: string]: any}} [values={}]
     * @param {ModelOptions} [options={}]
     * @returns {T}
     * @memberof Schema
     */
    public static NewInstance<T extends Model = Model>(type: typeof Model, values: {[key: string]: any} = {}, options: ModelOptions = {}): T {
        const describe = Describe.GetDescribe(type);
        let myValues = _.cloneDeep(values);
        const myOptions = _.cloneDeep(options);
        if(myOptions.isFromDatabase) {
            myValues = Object.getOwnPropertyNames(myValues).reduce((newValues: {[field: string]: any}, column: string) => {
                const field = describe.getIsColumn(column) ? describe.getFieldName(column) : column;
                newValues[field] = describe.fields[field]?.type.FromDatabase(myValues[column]) || myValues[column];
                return newValues;
            }, <any>{});
        }

        /* istanbul ignore else */
        if(!myOptions.ignoreDefaults) {
            Object.getOwnPropertyNames(describe.fieldsToColumns).forEach(field => {
                myValues[field] = myValues[field] === undefined ? describe.fields[field].defaultValue : myValues[field];
            });
        }

        const me = new (<ModelConstructor<T>><any>type)(myValues, myOptions);
        const innerIncludes: [string, any][] = [];
        const myIncludes: [string, any][] = [];

        myOptions.included?.forEach(include => {
            /* istanbul ignore else */
            if(describe.getRelationship(include[0])) {
                myIncludes.push(include);
            } else {
                innerIncludes.push(include);
            }
        });

        myIncludes.forEach(include => {
            (<any>me)[include[0]] = this.NewInstance(include[1], values, {
                ...options,
                included: _.cloneDeep(innerIncludes)
            })
        });
        
        return me;
    }

    /**
     *
     *
     * @private
     * @type {IPool}
     * @memberof Schema
     */
    private _pool: IPool;
    /**
     *
     *
     * @private
     * @type {IConnection}
     * @memberof Schema
     */
    private _connection: IConnection;
    /**
     *
     *
     * @private
     * @type {IQueryBuilderConstructor}
     * @memberof Schema
     */
    private queryBuilderConstructor: IQueryBuilderConstructor;
    /**
     *
     *
     * @private
     * @type {IDmlBuilder}
     * @memberof Schema
     */
    private dmlBuilder: IDmlBuilder;

    /**
     *Creates an instance of Schema.
     * @param {IAppConfig} appConfig
     * @param {IConnectionFactory} connFactory
     * @param {IQueryBuilderConstructor} [queryBuilderConstructor]
     * @param {IDmlBuilder} [dmlBuilder]
     * @memberof Schema
     */
    public constructor(
        @inject(Core.Configuration.IAppConfig) private appConfig: IAppConfig,
        @inject(Connection.IConnectionFactory) private connFactory: IConnectionFactory,
        @inject(EntitySymbols.QueryBuilderConstructor) @optional() queryBuilderConstructor?: IQueryBuilderConstructor,
        @inject(EntitySymbols.DmlBuilder) @optional()  dmlBuilder?: IDmlBuilder,
    ) {
        this.queryBuilderConstructor = queryBuilderConstructor || QueryBuilder;
        this.dmlBuilder = dmlBuilder || new DmlBuilder();
    }

    /**
     *
     *
     * @readonly
     * @protected
     * @type {IPool}
     * @memberof Schema
     */
    protected get pool(): IPool {
        if(!this._pool) {
            throw new EntityExceptions.SchemaNotConnected('Schema not connected. Did you mean GetPool(): Observable<IPool>?');
        }
        return this._pool;
    }

    /**
     *
     *
     * @readonly
     * @protected
     * @type {IConnection}
     * @memberof Schema
     */
    protected get connection(): IConnection {
        if(!this._connection) {
            throw new EntityExceptions.SchemaNotConnected('Schema not connected. Did you mean GetConnection(): Observable<IConnection>?');
        }
        return this._connection;
    }

    /**
     *
     *
     * @template T
     * @param {typeof Model} type
     * @param {IQueryFilter} [filter]
     * @returns {Observable<T[]>}
     * @memberof Schema
     */
    public Find<T extends Model = Model>(
        type: typeof Model,
        filter?: IQueryFilter
    ): Observable<T[]> {
        const eagerOrIncluded = type.Describe.getDetailRelationships().filter(r => r.inner && (r.strategy === Eager || filter?.include?.includes(r.key)));
        const childrenIncluded = type.Describe.getDetailsRelationships().filter(r => filter?.include?.includes(r.key));
        const junctionRelationships = type.Describe.getJunctionRelationships().filter(r => filter?.include?.includes(r.key));
        return this.GetConnection().pipe(
            mergeMap(connection => {
                return new this.queryBuilderConstructor(connection)
                    .Select(type)
                    .From(type)
                    .InnerJoin(...eagerOrIncluded)
                    .Where(...(filter?.filters || []))
                    .OrderBy(...(filter?.orderBy || []))
                    .Limit(filter?.limit, filter?.offset)
                    .Execute()
                    .pipe(
                        map(models => models.map(m => Schema.NewInstance<T>(type, m, {isFromDatabase: true, isNew: false, included: eagerOrIncluded.map(r => [r.key, <any>r.detail])}))),
                        mergeMap(models => {
                            if(childrenIncluded && childrenIncluded.length) {
                                return from(childrenIncluded)
                                    .pipe(
                                        concatMap(childRelationship => {
                                            const eager = childRelationship.detail.Describe.getDetailRelationships().filter(r => r.strategy === Eager);
                                            return new this.queryBuilderConstructor(connection)
                                                .Select(childRelationship.detail)
                                                .From(childRelationship.detail)
                                                .InnerJoin(...eager)
                                                .Where(...childRelationship.joins.map(join => FIELD(join.right, Operators.In, models.map(m => m.Get(join.left.field)))))
                                                .Execute().pipe(
                                                    map(children => children.map(child => Schema.NewInstance<T>(childRelationship.detail, child, {isNew: false, isFromDatabase: true, included: eager.map(r => [r.key, <any>r.detail])}))),
                                                    map(children => {
                                                        children.forEach(child => {
                                                            models.forEach(model => {
                                                                if(childRelationship.isDetail(model, child)) {
                                                                    model.Set(childRelationship.key, model.Get(childRelationship.key) || []);
                                                                    model.Get(childRelationship.key).push(child);
                                                                }
                                                            })
                                                        })
                                                    }),
                                                    tap(() => models.forEach(model => model.Set(childRelationship.key, model.Get(childRelationship.key) || [])))
                                                )
                                        }),
                                        reduce(() => {}),
                                        map(() => models)
                                    )
                            }
                            return of(models);
                        }),
                        mergeMap(models => {
                            if(junctionRelationships && junctionRelationships.length) {
                                return from(junctionRelationships).pipe(
                                    concatMap(junctionRelationship => {
                                        return new this.queryBuilderConstructor(connection)
                                            .Select(junctionRelationship.junction)
                                            .From(junctionRelationship.junction)
                                            .Where(...junctionRelationship.masterJoins.map(join => FIELD(join.right, Operators.In, Dedupe(models.map(m => m.Get(join.left.field))))))
                                            .Execute().pipe(
                                                map(jn => jn.map(j => Schema.NewInstance(junctionRelationship.junction, j, {isFromDatabase: true, isNew: false}))),
                                                mergeMap(junctions => new this.queryBuilderConstructor(connection)
                                                    .Select(junctionRelationship.detail)
                                                    .From(junctionRelationship.detail)
                                                    .Where(...junctionRelationship.detailJoins.map(join => FIELD(join.left, Operators.In, Dedupe(junctions.map(j => j.Get(join.right.field))))))
                                                    .Execute().pipe(
                                                        map(detailObjs => detailObjs.map(detailObj => Schema.NewInstance(junctionRelationship.detail, detailObj, {isFromDatabase: true, isNew: false}))),
                                                        map(details => junctionRelationship.CrossJoin(models, junctions, details))
                                                    )
                                                )
                                            )
                                    }),
                                    reduce(/* istanbul ignore next */() => {}),
                                    map(() => models)
                                )
                            }

                            return of(models);
                        })
                    )
            }),
            tap(() => this.pool.release(this.connection))
        )
    }

    /**
     *
     *
     * @template T
     * @param {typeof Model} type
     * @param {IQueryFilter} [filter]
     * @returns {Observable<T>}
     * @memberof Schema
     */
    public FindOne<T extends Model>(
        type: typeof Model,
        filter?: IQueryFilter
    ): Observable<T> {
        return this.Find<T>(type, {
            ...filter,
            limit: 1
        }).pipe(
            map(result => {
                /* istanbul ignore if */
                if(!result.length) {
                    throw new EntityExceptions.NoResultsException();
                }
                return result[0];
            })
        );
    }

    /**
     *
     *
     * @template T
     * @param {T} model
     * @returns {Observable<T>}
     * @memberof Schema
     */
    public Save<T extends Model>(model: T): Observable<T> {
        return this.GetConnection().pipe(
            mergeMap(connection => connection.procedure(...this.dmlBuilder.upsert(model))),
            map(result => {
                if(result.affectedRows === 1 && result.insertId) {
                    const auto = Describe.GetDescribe(model.Type).getAutoField();
                    /* istanbul ignore else */
                    if(auto) {
                        model.Set(auto.field, result.insertId);
                    }
                }
                return model;
            }),
            tap(() => this.pool.release(this.connection))
        );
    }

    /**
     *
     *
     * @template T
     * @param {T} model
     * @returns {Observable<void>}
     * @memberof Schema
     */
    public Delete<T extends Model>(model: T): Observable<void> {
        return this.GetConnection().pipe(
            mergeMap(connection => connection.procedure(...this.dmlBuilder.delete(model))),
            tap(() => this.pool.release(this.connection))
        );
    }

    /**
     *
     *
     * @param {typeof Model} type
     * @param {...IQueryFilterable[]} filters
     * @returns {Observable<void>}
     * @memberof Schema
     */
    public DeleteWhere(type: typeof Model, ...filters: IQueryFilterable[]): Observable<void> {
        const filtersAndInputs = GetFilterAndInputs(filters, true);
        return this.GetConnection().pipe(
            mergeMap(connection => connection.procedure<void>(`DELETE FROM ${type.Describe.schema}.${type.Describe.table} WHERE ${filtersAndInputs[0]}`, filtersAndInputs[1]))
        );
    }

    /**
     *
     *
     * @protected
     * @returns {Observable<IPool>}
     * @memberof Schema
     */
    protected GetPool(): Observable<IPool> {
        if(this._pool) {
            return of(this._pool);
        }
        return from(this.connFactory.connect(this.appConfig.schema.connection))
            .pipe(tap(pool => this._pool = pool));
    }

    /**
     *
     *
     * @protected
     * @returns {Observable<IConnection>}
     * @memberof Schema
     */
    protected GetConnection(): Observable<IConnection> {
        if(this._connection) {
            return of(this._connection);
        }
        return this.GetPool().pipe(
            mergeMap(pool => pool.getConnection()),
            tap(connection => this._connection = connection)
        );
    }
}