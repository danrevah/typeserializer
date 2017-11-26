
import {ExcludeSymbol} from '../consts';

export function Exclude(fn?: Function) {
  return (target: any, propertyKey: string) => {
    const list = Reflect.getMetadata(ExcludeSymbol, target) || [];
    Reflect.defineMetadata(ExcludeSymbol, list.concat({propertyKey, fn}), target);
  };
}
