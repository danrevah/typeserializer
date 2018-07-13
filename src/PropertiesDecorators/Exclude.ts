import {ExcludeSymbol} from '../consts';
import {PropertyConfig} from './interfaces';

export function Exclude(config?: PropertyConfig) {
  return function<T> (target: T, key: keyof T) {
    const list = Reflect.getMetadata(ExcludeSymbol, target) || [];
    Reflect.defineMetadata(ExcludeSymbol, list.concat({key, config}), target);
  };
}
