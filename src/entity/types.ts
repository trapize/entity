/**
 *
 *
 * @export
 * @interface ModelJSON
 */
export interface ModelJSON {
    type: string;
    /**
     *
     *
     * @type {(any|any[])}
     * @memberof ModelJSON
     */
    id: any|any[];
    /**
     *
     *
     * @type {{[key:string]: any}}
     * @memberof ModelJSON
     */
    attributes?: {[key:string]: any};
    /**
     *
     *
     * @type {({[key:string]: ModelJSON | ModelJSON[]})}
     * @memberof ModelJSON
     */
    includes?: {[key:string]: ModelJSON | ModelJSON[]};
}