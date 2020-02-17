import { IModel } from '../IModel';

export type DmlBuildResult = [string, any[]];

/**
 *
 *
 * @export
 * @interface IDmlBuilder
 */
export interface IDmlBuilder {
    /**
     *
     *
     * @param {IModel} model
     * @returns {DmlBuildResult}
     * @memberof IDmlBuilder
     */
    insert(model: IModel): DmlBuildResult;
    /**
     *
     *
     * @param {IModel} model
     * @returns {DmlBuildResult}
     * @memberof IDmlBuilder
     */
    update(model: IModel): DmlBuildResult;
    /**
     *
     *
     * @param {IModel} model
     * @returns {DmlBuildResult}
     * @memberof IDmlBuilder
     */
    delete(model: IModel): DmlBuildResult;
    /**
     *
     *
     * @param {IModel} model
     * @returns {DmlBuildResult}
     * @memberof IDmlBuilder
     */
    upsert(model: IModel): DmlBuildResult;
}