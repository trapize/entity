import { Model } from '../Model';
import { OperatorFunction } from 'rxjs';
import { ModelJSON } from '../types';
import { map } from 'rxjs/operators';


/**
 * Removes all fields in the object except those specified
 *
 * @export
 * @template T
 * @param {...string[]} fields
 * @returns {OperatorFunction<T, T extends Model ? ModelJSON : ModelJSON[]>}
 */
export function project<T extends Model|Model[]>(...fields: string[]): OperatorFunction<T, T extends Model ? ModelJSON : ModelJSON[]> {
    return models$ => models$.pipe(
        map(models => {
            if(Array.isArray(models)) {
                return (<Model[]>models).map(m => m.ToJSON());
            }
            return (<Model>models).ToJSON();
        }), 
        map(models => {
            const projectFn = (model: ModelJSON) => {
                if(model.attributes) {
                    Object.getOwnPropertyNames(model.attributes).forEach(key => {
                        if(!fields.includes(key)) {
                            delete (<any>model.attributes)[key];
                        }
                    });
                }

                if(model.attributes && !Object.getOwnPropertyNames(model.attributes).length) {
                    delete model.attributes;
                }

                if(model.includes) {
                    Object.getOwnPropertyNames(model.includes).forEach(key => {
                        if(!fields.includes(key)) {
                            delete (<any>model.includes)[key];
                        }
                    });
                }

                if(model.includes && !Object.getOwnPropertyNames(model.includes).length) {
                    delete model.includes;
                }
            }

            if(Array.isArray(models)) {
                models.forEach(projectFn);
            } else {
                projectFn(<ModelJSON>models);
            }
            return <T extends Model ? ModelJSON : ModelJSON[]>models;
        })
    );
}