
import {ExposeSymbol} from '../consts';

export function Expose(fn?: Function) {
  return (target: any, propertyKey: string) => {
    const list = Reflect.getMetadata(ExposeSymbol, target) || [];
    Reflect.defineMetadata(ExposeSymbol, list.concat({propertyKey, fn: fn ? fn.bind(this) : fn}), target);
  };
}
