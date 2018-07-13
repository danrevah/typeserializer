import {ExposeSymbol} from '../consts';
import {PropertyConfig} from './interfaces';

export function Expose(config?: PropertyConfig) {
  return function<T> (target: T, key: keyof T) {
    const list = Reflect.getMetadata(ExposeSymbol, target) || [];
    Reflect.defineMetadata(ExposeSymbol, list.concat({key, config}), target);
  };
}
