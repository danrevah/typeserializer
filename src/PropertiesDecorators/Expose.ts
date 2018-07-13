import {ExposeSymbol} from '../consts';

export function Expose() {
  return function<T> (target: T, key: keyof T) {
    const obj = Reflect.getMetadata(ExposeSymbol, target) || {};
    Reflect.defineMetadata(ExposeSymbol, {...obj, ...{[key]: true}}, target);
  };
}
