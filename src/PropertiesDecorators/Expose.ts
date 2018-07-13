import {ExposeSymbol} from '../consts';

export function Expose() {
  return function<T> (target: T, key: keyof T) {
    const metadata = Reflect.getMetadata(ExposeSymbol, target);

    if (!metadag)
    Reflect.defineMetadata(ExposeSymbol, true, target);

    console.log('metadata',metadata);

  };
}
