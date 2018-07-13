import {ExposeSymbol} from '../consts';

export function Expose(fn?: Function) {
  return function<T> (target: T, key: keyof T) {
    const list = Reflect.getMetadata(ExposeSymbol, target) || [];
    Reflect.defineMetadata(ExposeSymbol, list.concat({key, fn}), target);
  };
}
