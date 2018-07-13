import {ExcludeSymbol} from '../consts';

export function Exclude() {
  return function<T> (target: T, key: keyof T) {
    const obj = Reflect.getMetadata(ExcludeSymbol, target) || {};
    Reflect.defineMetadata(ExcludeSymbol, {...obj, ...{[key]: null}}, target);
  };
}
