import {BeforeSymbol} from '../consts';

export function Before(version: string) {
  return function<T> (target: T, key: keyof T) {
    const obj = Reflect.getMetadata(BeforeSymbol, target) || {};
    Reflect.defineMetadata(BeforeSymbol, {...obj, ...{[key]: version}}, target);
  };
}
