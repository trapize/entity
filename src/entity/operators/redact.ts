import { Model } from '../Model';
import { OperatorFunction } from 'rxjs';
import { ModelJSON } from '../types';
import { map } from 'rxjs/operators';


/**
 * Removes the specified fields
 *
 * @export
 * @template T
 * @param {...string[]} fields
 * @returns {OperatorFunction<T, T extends Model ? ModelJSON : ModelJSON[]>}
 */
export function redact<T extends Model|Model[]>(...fields:string[]): OperatorFunction<T, T extends Model ? ModelJSON : ModelJSON[]> {
    return models$ => models$.pipe(
        map(models => {
            if(Array.isArray(models)) {
                return (<Model[]>models).map(m => m.ToJSON());
            }
            return (<Model>models).ToJSON();
        }), 
        map(models => {
            const redactFn = (model: ModelJSON) => {
                fields.forEach(field => {
                    if(model.attributes) {
                        delete model.attributes[field];
                    }
                    if(model.includes) {
                        delete model.includes[field];
                    }
                });

                

                if(model.attributes && !Object.getOwnPropertyNames(model.attributes).length) {
                    delete model.attributes;
                }

                if(model.includes && !Object.getOwnPropertyNames(model.includes).length) {
                    delete model.includes;
                }
            };
            if(Array.isArray(models)) {
                models.forEach(redactFn);
            } else {
                redactFn(<ModelJSON>models);
            }
            return <T extends Model ? ModelJSON : ModelJSON[]>models;
        })
    );
}