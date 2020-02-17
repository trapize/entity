/**
 *
 *
 * @interface ModelConstructor
 */
interface ModelConstructor {
    new (): any;
    new (values: {[key: string]: any}, options: {[key: string]: any}): any;
}
/**
 *
 *
 * @export
 * @interface ModelOptions
 */
export interface ModelOptions {
    /**
     *
     *
     * @type {boolean}
     * @memberof ModelOptions
     */
    isNew?: boolean;
    /**
     *
     *
     * @type {boolean}
     * @memberof ModelOptions
     */
    isFromDatabase?: boolean;
    /**
     *
     *
     * @type {boolean}
     * @memberof ModelOptions
     */
    ignoreDefaults?: boolean;
    /**
     *
     *
     * @type {[string, ModelConstructor][]}
     * @memberof ModelOptions
     */
    included?: [string, ModelConstructor][];
}