// import {ClassStateSymbol} from '../consts';

export function Expose() {
  return function (target: any, propertyKey: string) {
    let descriptor = Object.getOwnPropertyDescriptor(target, propertyKey) || {};
    if (descriptor.enumerable != false) {
      descriptor.enumerable = false;
      descriptor.writable = true;
      Object.defineProperty(target, propertyKey, descriptor);
    }
  };
}
