import { IModelRepository } from './IModel.Repository';
import { Model } from '../Model';
import { IQueryFilter, FIELD, Operators, IQueryFilterable } from '../query-builder';
import { Observable, throwError } from 'rxjs';
import { ISchema } from '../ISchema';
import { Schema } from '../Schema';
import { Models } from '../helpers/Models';
import { IPrimaryKeyQuery } from '../query-builder/IPrimary.Key.Query';
import { EntityExceptions } from '../exceptions/Entity.Exception';



/**
 *
 *
 * @export
 * @class ModelRepository
 * @implements {IModelRepository<FullModel, PartialModel>}
 * @template FullModel
 * @template PartialModel
 */
export class ModelRepository<FullModel extends Model, PartialModel> implements IModelRepository<FullModel, PartialModel> {
    
    /**
     *Creates an instance of ModelRepository.
     * @param {typeof Model} type
     * @param {ISchema} schema
     * @memberof ModelRepository
     */
    public constructor(
        private type: typeof Model,
        private schema: ISchema
    ) {}

    /**
     *
     *
     * @param {IQueryFilter} [queryFilter]
     * @returns {Observable<FullModel[]>}
     * @memberof ModelRepository
     */
    public Find(queryFilter?: IQueryFilter): Observable<FullModel[]> {
        return this.schema.Find(this.type, queryFilter);
    }

    /**
     *
     *
     * @param {IQueryFilter} queryFilter
     * @returns {Observable<FullModel>}
     * @memberof ModelRepository
     */
    public FindOne(queryFilter: IQueryFilter): Observable<FullModel> {
        return this.schema.FindOne(this.type, queryFilter);
    }

    /**
     *
     *
     * @param {IPrimaryKeyQuery} query
     * @returns {Observable<FullModel[]>}
     * @memberof ModelRepository
     */
    public GetByPrimaryKeys(query: IPrimaryKeyQuery): Observable<FullModel[]> {
        const pks = this.type.Describe.getPrimaryKeys();
        if(query.values.length > pks.length) {
            return throwError(new Error());
        }

        return this.schema.Find(this.type, {
            include: query.include,
            offset: query.offset,
            limit: query.limit,
            orderBy: query.orderBy,
            filters: [...(query.filters || []), ...query.values.map((value, index)=> FIELD(pks[index], Operators.Eq, value))]
        });
    }

    /**
     *
     *
     * @param {PartialModel} partialModel
     * @returns {Observable<FullModel>}
     * @memberof ModelRepository
     */
    public Save(partialModel: PartialModel): Observable<FullModel> {
        const toSave = Schema.NewInstance<FullModel>(this.type, {}, {isFromDatabase: false});
        Models.Map(toSave, partialModel);
        return this.schema.Save<FullModel>(toSave);
    }

    /**
     *
     *
     * @param {...any[]} keyValues
     * @returns {Observable<void>}
     * @memberof ModelRepository
     */
    public Delete(...keyValues: any[]): Observable<void> {
        const pks = this.type.Describe.getPrimaryKeys();
        if(keyValues.length > pks.length) {
            return throwError(new EntityExceptions.InvalidOperationException('Key length mismatch'));
        }
        return this.DeleteWhere(...keyValues.map((value, index)=> FIELD(pks[index], Operators.Eq, value)));
    }

    /**
     *
     *
     * @param {...IQueryFilterable[]} filters
     * @returns {Observable<void>}
     * @memberof ModelRepository
     */
    public DeleteWhere(...filters: IQueryFilterable[]): Observable<void> {
        if(!filters.length) {
            return throwError(new EntityExceptions.InvalidOperationException('Unrestricted Delete'));
        }
        return this.schema.DeleteWhere(this.type, ...filters);
    }

}