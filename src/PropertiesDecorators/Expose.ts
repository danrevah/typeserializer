import {ExposeSymbol} from '../consts';

export function Expose() {
  return function<T> (target: T, key: keyof T) {
    Reflect.defineMetadata(ExposeSymbol, true, target);
    const metadata = Reflect.getMetadata(ExposeSymbol, target);
    console.log(metadata);

  };
}
