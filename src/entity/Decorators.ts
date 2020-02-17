import pluralize from 'pluralize';
import { Describe } from './Describe';
import { EntityExceptions } from './exceptions/Entity.Exception';
import { FieldDescribeResult } from './Field.Describe.Result';
import { DataType, DataTypes } from './Field.Type';
import { IFieldDescribeResult } from './IField.Describe.Result';
import { IModelDescribeResult } from './IModel.Describe.Result';
import { Join } from './Join';
import { Lazy, LoadStrategy } from './Load.Strategy';
import { DetailRelationship, DetailsRelationship, JunctionRelationship } from './Relations';
import { Strings } from '@trapize/core';

/**
 *
 *
 * @param {Object} target
 * @param {string} property
 * @returns
 */
function DefineAccessors(target: Object, property: string) {
    Object.defineProperty(target, property, {
        get() {
            return this._values[property];
        },
        set(value: any) {
            this.Set(property, value);
        },
        enumerable: true,
        configurable: true
    });
}

/**
 *
 *
 * @param {Object} target
 * @param {string} property
 * @returns
 */
function DefineReadonlyAccessors(target: Object, property: string) {
    Object.defineProperty(target, property, {
        get() {
            return this._values[property];
        },
        set(value: any) {
            if(this[property] === undefined || this[property] === null || this._previous[property] === value) {
                this.Set(property, value);
            } else {
                throw new EntityExceptions.AccessViolationException(`Property is Readonly: ${property}`);
            }
        },
        enumerable: true,
        configurable: true
    });
}

/**
 *
 *
 * @param {Object} target
 * @param {string} property
 * @param {(values?: any) => any} calculation
 * @returns
 */
function DefineCalculatedAccessors(target: Object, property: string, calculation: (values?: any) => any) {
    Object.defineProperty(target, property, {
        get() {
            return this._values[property] ? this._values[property] : calculation(this);
        },
        set(value: any) {
            throw new EntityExceptions.AccessViolationException(`Property is Readonly: ${property}`);
        },
        enumerable: true,
        configurable: true
    });
}

/**
 *
 *
 * @param {string} field
 * @param {string} column
 * @param {typeof DataType} type
 * @param {IModelDescribeResult} describe
 * @param {(fd: IFieldDescribeResult) => IFieldDescribeResult} callback
 */
function RegisterColumn(field: string, column: string | undefined, type: typeof DataType, describe: IModelDescribeResult, callback: (fd: IFieldDescribeResult) => IFieldDescribeResult): void {

    describe.fields[field] = callback(describe.fields[field] || new FieldDescribeResult(field, column, type));
} 

/**
 *
 *
 * @param {string} field
 * @param {IModelDescribeResult} describe
 * @param {(fd: IFieldDescribeResult) => IFieldDescribeResult} callback
 */
function UpdateColumn(field: string, describe: IModelDescribeResult, callback:(fd: IFieldDescribeResult) => IFieldDescribeResult): void {
    /* istanbul ignore if */
    if(!describe.fields[field]) {
        throw new EntityExceptions.EntityDefinitionException('Unable to find field. Did you forget to call Column first?');
    }
    describe.fields[field] = callback(describe.fields[field]);
}

/**
 *
 *
 * @param {string} schema
 * @param {string} name
 * @param {string} alias
 * @returns {ClassDecorator}
 */
function Table(schema: string, alias: string): ClassDecorator;
function Table(schema: string, table: string, alias: string): ClassDecorator;
function Table(schema: string, tableOrAlias: string, aliasParam?: string): ClassDecorator {
    return (target: Function) => {
        const name = aliasParam ? tableOrAlias : Strings.CamelToSnake(target.name);
        const alias = aliasParam ? aliasParam : tableOrAlias;
        Describe.AssertExtension(target.prototype);
        Describe.UpsertDescribe(target, describe => {
            describe.schema = schema;
            describe.table = name;
            describe.alias = alias;
            describe.plural = pluralize(target.name, 2);
            describe.getFields().forEach(f => {
                f.alias = alias;
                if(!f.column) {
                    f.column = f.isForeignKey ? Strings.CamelToSnake(f.field) : describe.table + '_' + Strings.CamelToSnake(f.field);
                }

                /* istanbul ignore next */
                describe.fieldsToColumns[f.field] = f.column ? f.column : f.field;
                /* istanbul ignore next */
                describe.columnsToFields[f.column ? f.column : f.field] = f.field;
            });
            
            return describe;
        });

        Describe.ValidateDescribe(target);
    }
}


/**
 *
 *
 * @param {boolean} [isNotAutoincremented]
 * @param {boolean} [isWritable]
 * @returns {PropertyDecorator}
 */
function Id(isNotAutoincremented?: boolean, isWritable?: boolean): PropertyDecorator;
/**
 *
 *
 * @param {string} name
 * @param {boolean} [isNotAutoincremented]
 * @param {boolean} [isWritable]
 * @returns {PropertyDecorator}
 */
function Id(name: string, isNotAutoincremented?: boolean, isWritable?: boolean): PropertyDecorator;
/**
 *
 *
 * @param {(string | boolean)} [nameOrIsNotAuto]
 * @param {boolean} [isNotAutoOrIsWritable=false]
 * @param {boolean} [isWritableParam=false]
 * @returns {PropertyDecorator}
 */
function Id(nameOrIsNotAuto?: string | boolean, isNotAutoOrIsWritable: boolean = false, isWritableParam: boolean = false): PropertyDecorator {
    return (target: Object, property: string | symbol) => {
        const name = typeof nameOrIsNotAuto === 'string' ? nameOrIsNotAuto : undefined;
        const isNotAutoincremented = typeof nameOrIsNotAuto === 'string' ? isNotAutoOrIsWritable : nameOrIsNotAuto;
        const isWritable = typeof nameOrIsNotAuto === 'string' ? isWritableParam : isNotAutoOrIsWritable;

        Describe.AssertExtension(target);
        /* istanbul ignore else */
        if(Describe.AssertPropertyKey(property)) {
            DefineReadonlyAccessors(target, property);
            Describe.UpsertDescribe(target, describeResult => {
                RegisterColumn(property, name, DataTypes.NUMBER, describeResult, fd => {
                    fd.isAutoIncrement = !isNotAutoincremented;
                    fd.isPrimaryKey = true;
                    fd.isReadonly = !isWritable;
                    describeResult.Id = fd;
                    return fd;
                });
                return describeResult;
            });
        }
    }
}


/**
 *
 *
 * @returns {PropertyDecorator}
 */
function PrimaryKey(): PropertyDecorator;
/**
 *
 *
 * @param {number} order
 * @returns {PropertyDecorator}
 */
function PrimaryKey(order: number): PropertyDecorator;
/**
 *
 *
 * @param {typeof DataType} [type]
 * @param {number} [order]
 * @returns {PropertyDecorator}
 */
function PrimaryKey(type: typeof DataType, order?: number): PropertyDecorator;

/**
 *
 *
 * @param {string} name
 * @param {typeof DataType} [type]
 * @param {number} [order]
 * @returns {PropertyDecorator}
 */
function PrimaryKey(name: string, type?: typeof DataType, order?: number): PropertyDecorator;
function PrimaryKey(nameOrTypeOrOrder?: string | typeof DataType | number, typeOrOrder?: typeof DataType | number, orderParam?: number): PropertyDecorator {
    let name = '';
    let type = DataTypes.NUMBER;
    let order = 1;
    if(typeof nameOrTypeOrOrder === 'number') {
        // PrimaryKey(order)
        order = 1;
    } else if(typeof nameOrTypeOrOrder === 'string') {
        // PrimaryKey(name, type?, order?)
        name = nameOrTypeOrOrder;
        type = <typeof DataType>typeOrOrder || type;
        order = orderParam === undefined ? order : orderParam;
    } else if(nameOrTypeOrOrder !== undefined) {
        // PrimaryKey(type, order?)
        type = <typeof DataType>nameOrTypeOrOrder;
        order = typeOrOrder === undefined ? order : <number>typeOrOrder;
    }

    return (target: Object, property: string | symbol) => {
        Describe.AssertExtension(target);
        /* istanbul ignore else */
        if(Describe.AssertPropertyKey(property)) {
            DefineAccessors(target, property);
            Describe.UpsertDescribe(target, describeResult => {
                RegisterColumn(property, name, type, describeResult, fd => {
                    fd.isAutoIncrement = false;
                    fd.isPrimaryKey = true;
                    fd.order = order;
                    return fd;
                });
                return describeResult;
            });
        }
    }
}


/**
 *
 *
 * @param {typeof DataType} type
 * @param {*} [defaultValue]
 * @returns {PropertyDecorator}
 */
function Column(type: typeof DataType, defaultValue?: any): PropertyDecorator;
/**
 *
 *
 * @param {string} name
 * @param {typeof DataType} type
 * @param {*} [defaultValue]
 * @returns {PropertyDecorator}
 */
function Column(name: string, type: typeof DataType, defaultValue?: any): PropertyDecorator;
function Column(nameOrType: string | typeof DataType, typeOrDefault?: typeof DataType | any, defaultValueParam?: any): PropertyDecorator {
    const name = typeof nameOrType === 'string' ? nameOrType : undefined;
    const type = typeof nameOrType === 'string' ? typeOrDefault : nameOrType;
    const defaultValue = typeof nameOrType === 'string' ? defaultValueParam : typeOrDefault;

    return (target: Object, property: string | symbol) => {
        Describe.AssertExtension(target);
        /* istanbul ignore else */
        if(Describe.AssertPropertyKey(property)) {
            DefineAccessors(target, property);
            Describe.UpsertDescribe(target, describeResult => {
                RegisterColumn(property, name, type, describeResult, fd => {
                    if(defaultValue !== null && defaultValue !== undefined) {
                        fd.defaultValue = defaultValue;
                    }
                    return fd;
                });
                return describeResult;
            });
        }
    }
}



/**
 *
 *
 * @returns {PropertyDecorator}
 */
function ForeignKey(): PropertyDecorator;
/**
 *
 *
 * @param {typeof DataType} type
 * @returns {PropertyDecorator}
 */
function ForeignKey(type: typeof DataType): PropertyDecorator;
/**
 *
 *
 * @param {string} name
 * @returns {PropertyDecorator}
 */
function ForeignKey(name: string): PropertyDecorator;
/**
 *
 *
 * @param {string} name
 * @param {typeof DataType} type
 * @returns {PropertyDecorator}
 */
function ForeignKey(name: string, type: typeof DataType): PropertyDecorator;
/**
 *
 *
 * @param {(string | typeof DataType)} [nameOrType]
 * @param {typeof DataType} [typeParam]
 * @returns {PropertyDecorator}
 */
function ForeignKey(nameOrType?: string | typeof DataType, typeParam?: typeof DataType): PropertyDecorator {
    const name = typeof nameOrType === 'string' ? nameOrType : undefined;
    const type = (typeof nameOrType === 'string' ? typeParam : nameOrType) || DataTypes.NUMBER;

    return (target: Object, property: string | symbol) => {
        Describe.AssertExtension(target);
        /* istanbul ignore else */
        if(Describe.AssertPropertyKey(property)) {
            DefineAccessors(target, property);
            Describe.UpsertDescribe(target, describeResult => {
                RegisterColumn(property, name, type, describeResult, fd => {
                    fd.isForeignKey = true;
                    return fd;
                });
                return describeResult;
            });
        }
    }
}


/**
 *
 *
 * @returns {PropertyDecorator}
 */
function VARCHAR(): PropertyDecorator;
/**
 *
 *
 * @param {string} name
 * @param {string} [defaultValue]
 * @returns {PropertyDecorator}
 */
function VARCHAR(name: string, defaultValue?: string): PropertyDecorator;
function VARCHAR(nameParam?: string, defaultValue?: string): PropertyDecorator {
    const name = nameParam ? nameParam : '';
    return Column(name, DataTypes.VARCHAR, defaultValue);
}

/**
 *
 *
 * @returns {PropertyDecorator}
 */
function CHAR(): PropertyDecorator;
/**
 *
 *
 * @param {string} name
 * @param {string} [defaultValue]
 * @returns {PropertyDecorator}
 */
function CHAR(name: string, defaultValue?: string): PropertyDecorator;
function CHAR(nameParam?: string, defaultValue?: string): PropertyDecorator {
    const name = nameParam ? nameParam : '';
    return Column(name, DataTypes.CHAR, defaultValue);
}


/**
 *
 *
 * @param {number} [defaultValue]
 * @returns {PropertyDecorator}
 */
function NUMBER(defaultValue?: number): PropertyDecorator;
/**
 *
 *
 * @param {string} name
 * @param {number} [defaultValue]
 * @returns {PropertyDecorator}
 */
function NUMBER(name: string, defaultValue?: number): PropertyDecorator;
function NUMBER(nameOrDefault?: string | number, defaultValueParam?: number): PropertyDecorator {
    const name = typeof nameOrDefault === 'string' ? nameOrDefault : '';
    const defaultValue = typeof nameOrDefault === 'string' ? defaultValueParam : nameOrDefault;
    return Column(name, DataTypes.NUMBER, defaultValue);
}

/**
 *
 *
 * @param {boolean} [defaultValue]
 * @returns {PropertyDecorator}
 */
function BOOLEAN(defaultValue?: boolean): PropertyDecorator;
/**
 *
 *
 * @param {string} name
 * @param {boolean} [defaultValue]
 * @returns {PropertyDecorator}
 */
function BOOLEAN(name: string, defaultValue?: boolean): PropertyDecorator;
function BOOLEAN(nameOrDefault?: string | boolean, defaultValueParam?: boolean): PropertyDecorator {
    const name = typeof nameOrDefault === 'string' ? nameOrDefault : '';
    const defaultValue = typeof nameOrDefault === 'string' ? defaultValueParam : nameOrDefault;
    return Column(name, DataTypes.BOOLEAN, defaultValue);
}

/**
 *
 *
 * @param {boolean} [defaultValue]
 * @returns {PropertyDecorator}
 */
function FLAG(defaultValue?: boolean): PropertyDecorator;
/**
 *
 *
 * @param {string} name
 * @param {boolean} [defaultValue]
 * @returns {PropertyDecorator}
 */
function FLAG(name: string, defaultValue?: boolean): PropertyDecorator;
function FLAG(nameOrDefault?: string | boolean, defaultValueParam?: boolean): PropertyDecorator {
    const name = typeof nameOrDefault === 'string' ? nameOrDefault : '';
    const defaultValue = typeof nameOrDefault === 'string' ? defaultValueParam : nameOrDefault;
    return Column(name, DataTypes.FLAG, defaultValue);
}


/**
 *
 *
 * @param {Date} [defaultValue]
 * @returns {PropertyDecorator}
 */
function DATE(defaultValue?: Date): PropertyDecorator;
/**
 *
 *
 * @param {string} name
 * @param {Date} [defaultValue]
 * @returns {PropertyDecorator}
 */
function DATE(name: string, defaultValue?: Date): PropertyDecorator;
function DATE(nameOrDefault?: string | Date, defaultValueParam?: Date): PropertyDecorator {
    const name = typeof nameOrDefault === 'string' ? nameOrDefault : '';
    const defaultValue = typeof nameOrDefault === 'string' ? defaultValueParam : nameOrDefault;
    return Column(name, DataTypes.DATE, defaultValue);
}

/**
 *
 *
 * @returns {PropertyDecorator}
 */
function Required(): PropertyDecorator {
    return (target: Object, property: string | symbol) => {
        Describe.AssertExtension(target);
        /* istanbul ignore else */
        if(Describe.AssertPropertyKey(property)) {
            Describe.UpsertDescribe(target, describeResult => {
                UpdateColumn(property, describeResult, fd => {
                    fd.isRequired = true;
                    return fd;
                });
                return describeResult;
            });
        }
    }
}

/**
 *
 *
 * @param {(dv: {[key:string]: any}) => any} fn
 * @returns {PropertyDecorator}
 */
function Calculated(fn: (dv: {[key:string]: any}) => any): PropertyDecorator {
    return (target: Object, property: string | symbol) => {
        Describe.AssertExtension(target);
        /* istanbul ignore else */
        if(Describe.AssertPropertyKey(property)) {
            DefineCalculatedAccessors(target, property, fn);
            Describe.UpsertDescribe(target, describeResult => {
                UpdateColumn(property, describeResult, fd => {
                    fd.isReadonly = true;
                    fd.isCalculated = true;
                    return fd;
                });
                return describeResult;
            });
        }
    }
}

/**
 *
 *
 * @returns {PropertyDecorator}
 */
function Readonly(): PropertyDecorator {
    return (target: Object, property: string | symbol) => {
        Describe.AssertExtension(target);
        /* istanbul ignore else */
        if(Describe.AssertPropertyKey(property)) {
            DefineReadonlyAccessors(target, property);
            Describe.UpsertDescribe(target, describeResult => {
                UpdateColumn(property, describeResult, fd => {
                    fd.isReadonly = true;
                    return fd;
                });
                return describeResult;
            });
        }
    }
}

/**
 *
 *
 * @param {Function} detail
 * @param {(Join | Join[])} joins
 * @param {typeof LoadStrategy} [strategy=Lazy]
 * @param {boolean} [outer=false]
 * @returns {PropertyDecorator}
 */
function Detail(
    detail: Function, 
    joins: Join | Join[], 
    strategy: typeof LoadStrategy = Lazy,
    outer: boolean = false
): PropertyDecorator {
    return (master: Object, key: string | symbol) => {
        Describe.AssertExtension(master);
        /* istanbul ignore else */
        if(Describe.AssertPropertyKey(key)) {
            Describe.UpsertDescribe(master, describeResult => {
                describeResult.setRelationship(key, new DetailRelationship(key, <any>master.constructor, <any>detail, Array.isArray(joins) ? joins : [joins], strategy, !outer));
                return describeResult;
            });
        }
    }
}

/**
 *
 *
 * @param {Function} detail
 * @param {(Join | Join[])} joins
 * @param {typeof LoadStrategy} [strategy=Lazy]
 * @returns {PropertyDecorator}
 */
function Details(
    detail: Function, 
    joins: Join | Join[], 
    strategy: typeof LoadStrategy = Lazy
): PropertyDecorator {
    return (master: Object, key: string | symbol) => {
        Describe.AssertExtension(master);
        /* istanbul ignore else */
        if(Describe.AssertPropertyKey(key)) {
            Describe.UpsertDescribe(master, describeResult => {
                describeResult.setRelationship(key, new DetailsRelationship(key,<any> master.constructor, <any>detail, Array.isArray(joins) ? joins : [joins], strategy));
                return describeResult;
            });
        }
    }
}

/**
 *
 *
 * @param {Function} junction
 * @param {Function} detail
 * @param {(Join | Join[])} masterJoins
 * @param {(Join | Join[])} detailJoins
 * @param {typeof LoadStrategy} [strategy=Lazy]
 * @returns {PropertyDecorator}
 */
function Junction(junction: Function, detail: Function, masterJoins: Join | Join[], detailJoins: Join | Join[], strategy: typeof LoadStrategy = Lazy): PropertyDecorator {
    return (master: Object, key: string | symbol) => {
        Describe.AssertExtension(master);
        /* istanbul ignore else */
        if(Describe.AssertPropertyKey(key)) {
            Describe.UpsertDescribe(master, describeResult => {
                describeResult.setRelationship(key, new JunctionRelationship(key, <any>master.constructor, <any>junction, <any>detail, Array.isArray(masterJoins) ? masterJoins : [masterJoins], Array.isArray(detailJoins) ? detailJoins : [detailJoins], strategy));
                return describeResult;
            });
        }
    }
}


export const Entity = {
    Column,
    Table,
    Id,
    PrimaryKey,
    ForeignKey,
    Required,
    Calculated,
    Readonly,
    Detail,
    Details,
    Junction,
    String: VARCHAR,
    Char: CHAR,
    Number: NUMBER,
    Boolean: BOOLEAN,
    Flag: FLAG,
    Date: DATE
}