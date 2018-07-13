import {AfterSymbol} from '../consts';

export function After(version: string) {
  return function<T> (target: T, key: keyof T) {
    const obj = Reflect.getMetadata(AfterSymbol, target) || {};
    Reflect.defineMetadata(AfterSymbol, {...obj, ...{[key]: version}}, target);
  };
}
