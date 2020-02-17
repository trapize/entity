import { Model } from '../Model';
import { OperatorFunction } from 'rxjs';
import { ModelJSON } from '../types';
import { map } from 'rxjs/operators';


/**
 * Replaces teh indicated fields with the masked value
 *
 * @export
 * @template T
 * @param {string} maskString
 * @param {string} field
 * @param {...string[]} fields
 * @returns {OperatorFunction<T, T extends Model ? ModelJSON : ModelJSON[]>}
 */
export function mask<T extends Model|Model[]>(maskString: string, field: string, ...fields:string[]): OperatorFunction<T, T extends Model ? ModelJSON : ModelJSON[]> {
    return models$ => models$.pipe(
        map(models => {
            if(Array.isArray(models)) {
                return (<Model[]>models).map(m => m.ToJSON());
            }
            return (<Model>models).ToJSON();
        }), 
        map(models => {
            fields.unshift(field);
            const maskFn = (model: ModelJSON) => {
                fields.forEach(f => {
                    if(model.attributes) {
                        model.attributes[f] = maskString;
                    }
                    if(model.includes) {
                        delete model.includes[f];
                    }
                });

                if(model.includes && Object.getOwnPropertyNames(model.includes).length === 0) {
                    delete model.includes;
                }
            };
            if(Array.isArray(models)) {
                models.forEach(maskFn);
            } else {
                maskFn(<ModelJSON>models);
            }

            return <T extends Model ? ModelJSON : ModelJSON[]>models;
        })
    );
}