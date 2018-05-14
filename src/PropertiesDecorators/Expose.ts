import {ClassStateSymbol} from '../consts';

export function Expose(fn?: Function) {
  return (target: any, propertyKey: string) => {
    const list = Reflect.getMetadata(ClassStateSymbol, target) || [];
    Reflect.defineMetadata(ClassStateSymbol, list.concat({propertyKey, fn}), target);
    console.log(target);
  };
}
