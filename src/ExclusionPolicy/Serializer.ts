
import 'reflect-metadata';
import {ExcludeSymbol, ExclusionStrategies, ExclusionStrategiesSymbol, ExposeSymbol, GroupsSymbol} from '../consts';

export function serialize(object: any, groupNames: string[] = []) {

  const strategy = Reflect.getMetadata(ExclusionStrategiesSymbol, object);
  const groups = Reflect.getMetadata(GroupsSymbol, object) || {};
  const exposed = Reflect.getMetadata(ExposeSymbol, object) || [];
  const excluded = Reflect.getMetadata(ExcludeSymbol, object) || [];

  const properties = groupNames.reduce((arr: string[], groupName: string) => {
    return arr.concat(groups[groupName] || []);
  }, []);

  return Object.getOwnPropertyNames(object).reduce((json: any, propertyKey: string) => {

    if (strategy === ExclusionStrategies.All &&
      (properties.length === 0 || properties.indexOf(propertyKey) > -1) &&
        exposed.find((e: any) => e.propertyKey === propertyKey)) {
      json[propertyKey] = object[propertyKey];
    }
    else if ((properties.length === 0 || properties.indexOf(propertyKey) > -1) &&
        !excluded.find((e: any) => e.propertyKey === propertyKey)) {
      json[propertyKey] = object[propertyKey];
    }

    return json;
  }, {});
}
