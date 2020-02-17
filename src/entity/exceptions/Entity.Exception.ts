import { Exception, IsObjectable } from '@trapize/core';


/**
 *
 *
 * @export
 * @class EntityException
 * @extends {Exception}
 */
export class EntityException extends Exception {
    protected _source: string = 'Core.Entity';
}


/**
 *
 *
 * @export
 * @class InvalidModelException
 * @extends {EntityException}
 */
export class InvalidModelException extends EntityException {
    public ToJSON(): {[key: string]: any} {
        return {
            ...super.ToJSON(),
            data: IsObjectable(this.Data) ? this.Data.ToJSON() : this.Data
        };
    }
}


/**
 *
 *
 * @export
 * @class InvalidQueryException
 * @extends {EntityException}
 */
export class InvalidQueryException extends EntityException {}


/**
 *
 *
 * @export
 * @class InvalidOperationException
 * @extends {EntityException}
 */
export class InvalidOperationException extends EntityException {}


/**
 *
 *
 * @export
 * @class EntityDefinitionException
 * @extends {EntityException}
 */
export class EntityDefinitionException extends EntityException {}


/**
 *
 *
 * @export
 * @class AccessViolationException
 * @extends {EntityException}
 */
export class AccessViolationException extends EntityException {}


/**
 *
 *
 * @export
 * @class InvalidEntityException
 * @extends {EntityException}
 */
export class InvalidEntityException extends EntityException {}


/**
 *
 *
 * @export
 * @class InvalidAccessorException
 * @extends {EntityException}
 */
export class InvalidAccessorException extends EntityException {}


/**
 *
 *
 * @export
 * @class InvalidRelationshipException
 * @extends {EntityException}
 */
export class InvalidRelationshipException extends EntityException {}


/**
 *
 *
 * @export
 * @class NoResultsException
 * @extends {EntityException}
 */
export class NoResultsException extends EntityException {}


/**
 *
 *
 * @export
 * @class TooManyResultsException
 * @extends {EntityException}
 */
export class TooManyResultsException extends EntityException {}

/**
 *
 *
 * @export
 * @class SchemaNotConnected
 * @extends {EntityException}
 */
export class SchemaNotConnected extends EntityException {}

export const EntityExceptions = {
    InvalidModelException: InvalidModelException,
    InvalidQueryException: InvalidQueryException,
    InvalidOperationException: InvalidOperationException,
    EntityDefinitionException: EntityDefinitionException,
    AccessViolationException: AccessViolationException,
    InvalidEntityException: InvalidEntityException,
    InvalidAccessorException: InvalidAccessorException,
    InvalidRelationshipException: InvalidRelationshipException,
    NoResultsException: NoResultsException,
    SchemaNotConnected: SchemaNotConnected,
    TooManyResultsException: TooManyResultsException
};