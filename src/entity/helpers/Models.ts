import { Model } from '../Model';

/**
 *
 *
 * @export
 * @class Models
 */
export class Models {
    /**
     *
     *
     * @static
     * @template T
     * @param {T} model
     * @param {*} partial
     * @returns {T}
     * @memberof Models
     */
    public static Map<T extends Model>(model: T, partial: any): T {
        Object.getOwnPropertyNames(partial).forEach(key => {
            model.Set(key, partial[key]);
        });
        return model;
    }
}