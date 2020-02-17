
/**
 *
 *
 * @export
 * @interface IModel
 */
export interface IModel {
    IsModified: boolean;
    /**
     *
     *
     * @type {boolean}
     * @memberof IModel
     */
    IsNew: boolean;
    /**
     *
     *
     * @type {Function}
     * @memberof IModel
     */
    readonly Type: Function;
    /**
     *
     *
     * @type {Function}
     * @memberof IModel
     */
    readonly Constructor: Function;
    /**
     *
     *
     * @param {string} key
     * @param {*} value
     * @memberof IModel
     */
    Set(key: string, value: any): void;
    /**
     *
     *
     * @template T
     * @param {string} key
     * @returns {T}
     * @memberof IModel
     */
    Get<T = any>(key: string): T;
    /**
     *
     *
     * @template T
     * @param {string} key
     * @returns {T}
     * @memberof IModel
     */
    GetPrevious<T = any>(key: string): T;
    /**
     *
     *
     * @param {string} key
     * @returns {boolean}
     * @memberof IModel
     */
    GetIsChanged(key: string): boolean;
}