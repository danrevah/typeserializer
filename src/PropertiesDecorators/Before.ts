
import {BeforeSymbol} from '../consts';

export function Before(version: string) {
  return function (target: any, propertyKey: string) {
    const list = Reflect.getMetadata(BeforeSymbol, target) || [];
    Reflect.defineMetadata(BeforeSymbol, list.concat({propertyKey, version}), target);
  };
}
