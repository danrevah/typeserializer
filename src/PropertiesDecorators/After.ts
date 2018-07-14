import {AfterSymbol} from '../consts';
import {isUndefined} from '../helpers';

export function After(version: string) {
  return function<T> (target: T, key: keyof T) {
    const obj = Reflect.getMetadata(AfterSymbol, target) || {};

    if (!isUndefined(obj[key])) {
      throw new Error(
        `Cannot apply @After decorator twice on property '${key}' of class '${target.constructor.name}'.`
      );
    }

    Reflect.defineMetadata(AfterSymbol, {...obj, ...{[key]: version}}, target);
  };
}
