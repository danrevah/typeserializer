import {ExcludeSymbol} from '../consts';
import {isUndefined} from '../helpers';

export function Exclude() {
  return function<T> (target: T, key: keyof T) {
    const obj = Reflect.getMetadata(ExcludeSymbol, target) || {};

    if (!isUndefined(obj[key])) {
      throw new Error(
        `Cannot apply @Exclude decorator twice on property '${key}' of class '${target.constructor.name}'.`
      );
    }

    Reflect.defineMetadata(ExcludeSymbol, {...obj, ...{[key]: true}}, target);
  };
}
