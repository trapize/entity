import { IFormatable } from '@trapize/core';
import { IFieldDescribeResult, isIFieldDescribeResult } from '../IField.Describe.Result';
import { Operator } from './Query.Operators';


/**
 *
 *
 * @export
 * @interface IQueryFilterable
 * @extends {IFormatable}
 */
export interface IQueryFilterable extends IFormatable {
    /**
     *
     *
     * @returns {any[]}
     * @memberof IQueryFilterable
     */
    GetInputs(): any[];
    /**
     *
     *
     * @returns {string}
     * @memberof IQueryFilterable
     */
    ToStringNoAlias(): string;
}


/**
 *
 *
 * @class FilterField
 * @implements {IFormatable}
 */
class FilterField implements IFormatable {
    /**
     *Creates an instance of FilterField.
     * @param {IFieldDescribeResult} field
     * @memberof FilterField
     */
    public constructor(
        public field: IFieldDescribeResult
    ) {}

    /**
     *
     *
     * @returns {string}
     * @memberof FilterField
     */
    public ToString(): string {
        return `${this.field.alias}.${this.field.column}`;
    }

    /**
     *
     *
     * @returns {string}
     * @memberof FilterField
     */
    public ToStringNoAlias(): string {
        return `${this.field.column}`;
    }
}


/**
 *
 *
 * @class Filter
 * @implements {IQueryFilterable}
 */
class Filter implements IQueryFilterable {

    /**
     *Creates an instance of Filter.
     * @param {FilterField} left
     * @param {typeof Operator} operator
     * @param {(FilterField | any)} [right]
     * @memberof Filter
     */
    public constructor(private left: FilterField, public operator: typeof Operator, public right?: FilterField | any) {}

    /**
     *
     *
     * @returns {string}
     * @memberof Filter
     */
    public ToString(): string {
        return `${this.left.ToString()} ${this.operator.ToString()}${this.IsRightDefinted() && this.operator.HasRightOperand() ? this.right instanceof FilterField ? ' ' + this.right.ToString() : ' ' + this.operator.RightOperand() : ''}`;
    }

    /**
     *
     *
     * @returns {string}
     * @memberof Filter
     */
    public ToStringNoAlias(): string {
        return `${this.left.ToStringNoAlias()} ${this.operator.ToString()}${this.IsRightDefinted() && this.operator.HasRightOperand() ? this.right instanceof FilterField ? ' ' + this.right.ToStringNoAlias() : ' ' + this.operator.RightOperand() : ''}`
    }

    /**
     *
     *
     * @returns {any[]}
     * @memberof Filter
     */
    public GetInputs(): any[] {
        return !this.IsRightDefinted() || this.right instanceof FilterField || !this.operator.HasRightOperand() ? [] : [this.right];  
    }

    /**
     *
     *
     * @private
     * @returns {boolean}
     * @memberof Filter
     */
    private IsRightDefinted(): boolean {
        return this.right !== undefined && this.right !== null;
    }
}

/**
 *
 *
 * @class Or
 * @implements {IQueryFilterable}
 */
class Or implements IQueryFilterable {
    
    private filters: IQueryFilterable[] = [];

    /**
     *Creates an instance of Or.
     * @param {...IQueryFilterable[]} filters
     * @memberof Or
     */
    public constructor(...filters: IQueryFilterable[]) {
        this.filters = filters;
    }

    /**
     *
     *
     * @returns {string}
     * @memberof Or
     */
    public ToString(): string {
        return this.filters.length ? `(${this.filters.map(filter => filter.ToString()).join(' OR ')})` : '';
    }

    /**
     *
     *
     * @returns {string}
     * @memberof Or
     */
    public ToStringNoAlias(): string {
        return this.filters.length ? `(${this.filters.map(filter => filter.ToStringNoAlias()).join(' OR ')})` : '';
    }

    /**
     *
     *
     * @returns {any[]}
     * @memberof Or
     */
    public GetInputs(): any[] {
        return this.filters.reduce((inputs: any[], filter: IQueryFilterable) => [...inputs, ...filter.GetInputs()], []);
    }
}

/**
 *
 *
 * @class And
 * @implements {IQueryFilterable}
 */
class And implements IQueryFilterable {
    private filters: IQueryFilterable[] = [];

    /**
     *Creates an instance of And.
     * @param {...IQueryFilterable[]} filters
     * @memberof And
     */
    public constructor(...filters: IQueryFilterable[]) {
        this.filters = filters;
    }

    /**
     *
     *
     * @returns {string}
     * @memberof And
     */
    public ToString(): string {
        return this.filters.length ? `(${this.filters.map(filter => filter.ToString()).join(' AND ')})` : '';
    }

    /**
     *
     *
     * @returns {string}
     * @memberof And
     */
    public ToStringNoAlias(): string {
        return this.filters.length ? `(${this.filters.map(filter => filter.ToStringNoAlias()).join(' AND ')})` : '';
    }

    /**
     *
     *
     * @returns {any[]}
     * @memberof And
     */
    public GetInputs(): any[] {
        return this.filters.reduce((inputs: any[], filter: IQueryFilterable) => [...inputs, ...filter.GetInputs()], []);
    }
}


/**
 *
 *
 * @export
 * @param {IQueryFilterable[]} filters
 * @param {boolean} [noAlias=false]
 * @returns {[string, any[]]}
 */
export function GetFilterAndInputs(filters: IQueryFilterable[], noAlias: boolean = false): [string, any[]] {
    return [
        filters.map(filter => noAlias ? filter.ToStringNoAlias() : filter.ToString()).join(' AND '),
        filters.reduce((inputs: any[], filter: IQueryFilterable) => [...inputs, ...filter.GetInputs()], [])
    ];
}

/**
 *
 *
 * @export
 * @param {...IQueryFilterable[]} filters
 * @returns {IQueryFilterable}
 */
export function AND(...filters: IQueryFilterable[]): IQueryFilterable {
    return new And(...filters);
}

/**
 *
 *
 * @export
 * @param {...IQueryFilterable[]} filters
 * @returns {IQueryFilterable}
 */
export function OR(...filters: IQueryFilterable[]): IQueryFilterable {
    return new Or(...filters);
}

/**
 *
 *
 * @export
 * @param {IFieldDescribeResult} field
 * @param {typeof Operator} operator
 * @param {*} [rightOrField]
 * @returns {IQueryFilterable}
 */
export function FIELD(field: IFieldDescribeResult, operator: typeof Operator, rightOrField?: any): IQueryFilterable {
    
    return new Filter(new FilterField(field), operator, isIFieldDescribeResult(rightOrField) ? new FilterField(rightOrField) : rightOrField);
}