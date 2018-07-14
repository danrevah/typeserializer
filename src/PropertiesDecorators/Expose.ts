import {ExposeSymbol} from '../consts';
import {isUndefined} from '../helpers';

export function Expose() {
  return function<T> (target: T, key: keyof T) {
    const obj = Reflect.getMetadata(ExposeSymbol, target) || {};

    if (!isUndefined(obj[key])) {
      throw new Error(
        `Cannot apply @Expose decorator twice on property '${key}' of class '${target.constructor.name}'.`
      );
    }

    Reflect.defineMetadata(ExposeSymbol, {...obj, ...{[key]: true}}, target);
  };
}
