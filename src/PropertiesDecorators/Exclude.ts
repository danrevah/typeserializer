import {ExcludeSymbol} from '../consts';

export function Exclude(fn?: Function) {
  return function<T> (target: T, key: keyof T) {
    const list = Reflect.getMetadata(ExcludeSymbol, target) || [];
    Reflect.defineMetadata(ExcludeSymbol, list.concat({key, fn}), target);
  };
}
