import {ExcludeSymbol} from '../consts';
import {PropertyConfig} from './interfaces';

export function Exclude(config?: PropertyConfig) {
  return function<T> (target: T, key: keyof T) {
    const obj = Reflect.getMetadata(ExcludeSymbol, target) || {};
    Reflect.defineMetadata(ExcludeSymbol, {...obj, ...{[key]: config}}, target);
  };
}
