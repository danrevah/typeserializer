import {NameSymbol} from '../consts';

export function Name(name: string) {
  return function<T> (target: T, key: keyof T) {
    const obj = Reflect.getMetadata(NameSymbol, target) || {};
    Reflect.defineMetadata(NameSymbol, {...obj, ...{[key]: name}}, target);
  };
}
