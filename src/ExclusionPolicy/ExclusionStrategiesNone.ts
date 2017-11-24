
import 'reflect-metadata';
import {ExcludeSymbol, ExclusionStrategies, ExclusionStrategiesSymbol} from './consts';

export function ExclusionStrategiesNone (c: any): any {

  return class extends (c as { new(...args: any[]): any; }) {

    constructor(...args: any[]) {
      super(...args);

      Reflect.defineMetadata(ExclusionStrategiesSymbol, ExclusionStrategies.None, this);

      const exclude = Reflect.getMetadata(ExcludeSymbol, this) || [];

      Object.getOwnPropertyNames(this).forEach((propertyKey: any) => {
        if (exclude.find((e: any) => e.propertyKey === propertyKey)) {
          Object.defineProperty(this, propertyKey, {enumerable: false});
        }
      });
    }
  }
}
