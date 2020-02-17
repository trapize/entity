import { IFieldDescribeResult } from './IField.Describe.Result';

/**
 *
 *
 * @class JoinImpl
 * @implements {Join}
 */
class JoinImpl implements Join {
    /**
     *
     *
     * @type {IFieldDescribeResult}
     * @memberof JoinImpl
     */
    public readonly left: IFieldDescribeResult;
    /**
     *
     *
     * @type {IFieldDescribeResult}
     * @memberof JoinImpl
     */
    public readonly right: IFieldDescribeResult;

    /**
     *Creates an instance of JoinImpl.
     * @param {IFieldDescribeResult} left
     * @param {IFieldDescribeResult} right
     * @memberof JoinImpl
     */
    public constructor(left: IFieldDescribeResult, right: IFieldDescribeResult) {
        this.left = left;
        this.right = right;
    }
}



/**
 *
 *
 * @export
 * @interface Join
 */
export interface Join {
    /**
     *
     *
     * @type {IFieldDescribeResult}
     * @memberof Join
     */
    readonly left: IFieldDescribeResult;
    /**
     *
     *
     * @type {IFieldDescribeResult}
     * @memberof Join
     */
    readonly right: IFieldDescribeResult;
}

/**
 *
 *
 * @export
 * @param {IFieldDescribeResult} left
 * @param {IFieldDescribeResult} right
 * @returns {Join}
 */
export function JOIN(left: IFieldDescribeResult, right: IFieldDescribeResult): Join {
    return new JoinImpl(left, right);
}
