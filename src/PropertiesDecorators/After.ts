
import {AfterSymbol} from '../consts';

export function After(version: string) {
  return function (target: any, propertyKey: string) {
    const list = Reflect.getMetadata(AfterSymbol, target) || [];
    Reflect.defineMetadata(AfterSymbol, list.concat({propertyKey, version}), target);
  };
}
