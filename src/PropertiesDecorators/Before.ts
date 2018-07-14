import {BeforeSymbol} from '../consts';
import {isUndefined} from '../helpers';

export function Before(version: string) {
  return function<T> (target: T, key: keyof T) {
    const obj = Reflect.getMetadata(BeforeSymbol, target) || {};

    if (!isUndefined(obj[key])) {
      throw new Error(
        `Cannot apply @Before decorator twice on property '${key}' of class '${target.constructor.name}'.`
      );
    }

    Reflect.defineMetadata(BeforeSymbol, {...obj, ...{[key]: version}}, target);
  };
}
