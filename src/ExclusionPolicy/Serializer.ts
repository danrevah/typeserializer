
import 'reflect-metadata';
import {
  AfterSymbol,
  BeforeSymbol, ExcludeSymbol, ExclusionStrategies, ExclusionStrategiesSymbol, ExposeSymbol,
  GroupsSymbol
} from '../consts';
import {isObject, versionCompare} from '../helpers';
import {MiddlewareOptions} from '../Express/models';

export function serialize(object: any, groupNames: string[] = [], options: MiddlewareOptions = {}) {

  const strategy = Reflect.getMetadata(ExclusionStrategiesSymbol, object);
  const groups = Reflect.getMetadata(GroupsSymbol, object) || {};
  const exposed = Reflect.getMetadata(ExposeSymbol, object) || [];
  const excluded = Reflect.getMetadata(ExcludeSymbol, object) || [];
  const before = Reflect.getMetadata(BeforeSymbol, object) || [];
  const after = Reflect.getMetadata(AfterSymbol, object) || [];

  const properties = groupNames.reduce((arr: string[], groupName: string) => arr.concat(groups[groupName] || []), []);

  return Object.getOwnPropertyNames(object).reduce((json: any, propertyKey: string) => {

    if (!isVersionMatch(before, after, options.version, propertyKey)) {
      return json;
    }

    const value = object[propertyKey];

    if (isExclusionStrategyAllAndPropertyExposed(strategy, exposed, propertyKey, properties, object) ||
        isExclusionStrategyNoneAndPropertyNotExcluded(strategy, excluded, propertyKey, properties, object)) {
      json[propertyKey] = isObject(value) ? serialize(value, groupNames) : value;
    }
    else if (strategy !== ExclusionStrategies.All && strategy !== ExclusionStrategies.None) {
      json[propertyKey] = value;
    }

    return json;
  }, {});
}

// Private
function isVersionMatch(beforeList: any[], afterList: any[], version: string | undefined, propertyKey: string) {
  if (!version) {
    return true;
  }

  const beforeProperty = beforeList.find((elm: any) => elm.propertyKey === propertyKey);

  if (beforeProperty) {
    return versionCompare(beforeProperty.version, version) === 1;
  }

  const afterProperty = afterList.find((elm: any) => elm.propertyKey === propertyKey);

  if (afterProperty) {
    return versionCompare(afterProperty.version, version) <= 0;
  }

  return true;
}

function isExclusionStrategyAllAndPropertyExposed(strategy: any, exposed: string[], propertyKey: string, properties: string[], object: any) {
  if (strategy === ExclusionStrategies.All &&
    (properties.length === 0 || properties.indexOf(propertyKey) > -1)) {
    const elm: any = exposed.find((e: any) => e.propertyKey === propertyKey);
    return elm && elm.fn ? elm.fn(object, propertyKey) : elm;
  }

  return false;
}

function isExclusionStrategyNoneAndPropertyNotExcluded(strategy: any, excluded: string[], propertyKey: string, properties: string[], object: any) {
  if (strategy === ExclusionStrategies.None &&
    (properties.length === 0 || properties.indexOf(propertyKey) > -1)) {
    const elm: any = excluded.find((e: any) => e.propertyKey === propertyKey);
    return elm && elm.fn ? !elm.fn(object, propertyKey) : !elm;
  }

  return false;
}
