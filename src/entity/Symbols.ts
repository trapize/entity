export const EntitySymbols = {
    QueryBuilderConstructor: Symbol.for('IQueryBuilderConstructor, Core.Entity.QueryBuilder'),
    DmlBuilder: Symbol.for('IDMLBuilder, Core.Entity.QueryBuilder'),
    ISchema: Symbol.for('ISchema, Core.Entity'),
    IModelRepositoryFactory: Symbol.for('IModelRepositoryFactory, Core.Entity.Repositories'),
    IModelServiceFactory: Symbol.for('IModelServiceFactory, Core.Entity.Services')
}