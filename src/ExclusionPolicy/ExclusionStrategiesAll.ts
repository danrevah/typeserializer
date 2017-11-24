
import 'reflect-metadata';
import {ExclusionStrategies, ExclusionStrategiesSymbol, ExposeSymbol} from './consts';

export function ExclusionStrategiesAll (c: any): any {

  return class extends (c as { new(...args: any[]): any; }) {

    constructor(...args: any[]) {
      super(...args);

      Reflect.defineMetadata(ExclusionStrategiesSymbol, ExclusionStrategies.All, this);

      const exposed = Reflect.getMetadata(ExposeSymbol, this) || [];

      Object.getOwnPropertyNames(this).forEach((propertyKey: any) => {
        if (!exposed.find((e: any) => e.propertyKey === propertyKey)) {
          Object.defineProperty(this, propertyKey, {enumerable: false});
        }
      });
    }
  }
}
