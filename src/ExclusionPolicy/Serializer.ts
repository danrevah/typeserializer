
import 'reflect-metadata';
import {ExcludeSymbol, ExclusionStrategies, ExclusionStrategiesSymbol, ExposeSymbol, GroupsSymbol} from '../consts';
import {isObject} from '../helpers';

export function serialize(object: any, groupNames: string[] = []) {

  const strategy = Reflect.getMetadata(ExclusionStrategiesSymbol, object);
  const groups = Reflect.getMetadata(GroupsSymbol, object) || {};
  const exposed = Reflect.getMetadata(ExposeSymbol, object) || [];
  const excluded = Reflect.getMetadata(ExcludeSymbol, object) || [];

  const properties = groupNames.reduce((arr: string[], groupName: string) => {
    return arr.concat(groups[groupName] || []);
  }, []);

  return Object.getOwnPropertyNames(object).reduce((json: any, propertyKey: string) => {

    const value = object[propertyKey];

    if (isExclusionStrategyAllAndPropertyExposed(strategy, exposed, propertyKey, properties) ||
        isExclusionStrategyNoneAndPropertyNotExcluded(strategy, excluded, propertyKey, properties)) {

      json[propertyKey] = isObject(value) ? serialize(value, groupNames) : value;
    }
    else if (strategy !== ExclusionStrategies.All && strategy !== ExclusionStrategies.None) {
      json[propertyKey] = value;
    }

    return json;
  }, {});
}

// Private
function isExclusionStrategyAllAndPropertyExposed(strategy: any, exposed: string[], propertyKey: string, properties: string[]) {
  return strategy === ExclusionStrategies.All &&
    (properties.length === 0 || properties.indexOf(propertyKey) > -1) &&
    exposed.find((e: any) => e.propertyKey === propertyKey);
}

function isExclusionStrategyNoneAndPropertyNotExcluded(strategy: any, excluded: string[], propertyKey: string, properties: string[]) {
  return strategy === ExclusionStrategies.None &&
    (properties.length === 0 || properties.indexOf(propertyKey) > -1) &&
    !excluded.find((e: any) => e.propertyKey === propertyKey);
}
