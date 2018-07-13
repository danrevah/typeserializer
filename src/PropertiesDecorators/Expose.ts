import {ClassStateSymbol} from '../consts';

export function Expose(fn?: Function) {
  return (target: any, propertyKey: string) => {
    const state = Reflect.getMetadata(ClassStateSymbol, target) || [];
    Object.defineProperty(target, propertyKey, { enumerable: false, writable: true });
    console.log(state);
  };
}
