import {NameSymbol} from '../consts';
import {isUndefined} from '../helpers';

export function Name(name: string) {
  return function<T> (target: T, key: keyof T) {
    const obj = Reflect.getMetadata(NameSymbol, target) || {};

    if (!isUndefined(obj[key])) {
      throw new Error(
        `Cannot apply @Name decorator twice on property '${key}' of class '${target.constructor.name}'.`
      );
    }

    Reflect.defineMetadata(NameSymbol, {...obj, ...{[key]: name}}, target);
  };
}
