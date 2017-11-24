
import 'reflect-metadata';
import {ExposeSymbol, GroupsSymbol} from './consts';

export function ExclusionStrategiesAll (c: any): any {

  return class extends (c as { new(...args: any[]): any; }) {

    // @todo export to base parent with ExclusionStrategiesNone
    toSerializedJSON(groupNames: string[] = []) {
      const groups = Reflect.getMetadata(GroupsSymbol, this) || {};
      const exposed = Reflect.getMetadata(ExposeSymbol, this) || [];

      const exposedProperties = groupNames.reduce((exposed: string[], groupName: string) => {
        return exposed.concat(groups[groupName] || []);
      }, []);

      return Object.getOwnPropertyNames(this).reduce((json: any, propertyKey: string) => {

        if (exposedProperties.indexOf(propertyKey) > -1 &&
            exposed.find((e: any) => e.propertyKey === propertyKey)) {
          json[propertyKey] = this[propertyKey];
        }

        return json;
      }, {});
    }

    constructor(...args: any[]) {
      super(...args);

      const exposed = Reflect.getMetadata(ExposeSymbol, this) || [];

      Object.getOwnPropertyNames(this).forEach((propertyKey: any) => {
        if (!exposed.find((e: any) => e.propertyKey === propertyKey)) {
          Object.defineProperty(this, propertyKey, {enumerable: false});
        }
      });
    }
  }
}
