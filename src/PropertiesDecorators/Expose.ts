
import {ExposeSymbol} from '../ExclusionPolicy/consts';

export function Expose() {
  return function (target: any, propertyKey: string) {
    const list = Reflect.getMetadata(ExposeSymbol, target) || [];
    Reflect.defineMetadata(ExposeSymbol, list.concat({propertyKey}), target);
  };
}
