import {
  AfterSymbol, BeforeSymbol, ExcludeSymbol, ExclusionPolicy,
  ExposeSymbol, GroupsSymbol, NameSymbol, StrategySymbol
} from '../consts';
import {isObject, versionCompare} from '../helpers';

export function serialize(obj: any, groups?: string[], version?: string) {
  if (Array.isArray(obj)) {
    return JSON.stringify(transformArray(obj, groups, version));
  }

  return JSON.stringify(transform(obj, groups, version));
}

// -- Private --
function transformArray(arr: any[], groups?: string[], version?: string): any {
  return arr.map((elm: any) =>
    (Array.isArray(elm))
      ? transformArray(elm, groups, version)
      : transform(elm, groups, version)
  );
}

function transform(obj: any, groups?: string[], version?: string) {
  const excludeMap = Reflect.getMetadata(ExcludeSymbol, obj) || {};
  const exposeMap = Reflect.getMetadata(ExposeSymbol, obj) || {};
  const groupsMap = Reflect.getMetadata(GroupsSymbol, obj) || {};
  const beforeMap = Reflect.getMetadata(BeforeSymbol, obj) || {};
  const afterMap = Reflect.getMetadata(AfterSymbol, obj) || {};
  const nameMap = Reflect.getMetadata(NameSymbol, obj) || {};
  const strategy = Reflect.getMetadata(StrategySymbol, obj.constructor);

  return Object.getOwnPropertyNames(obj).reduce((json: any, key: string) => {
    const name = nameMap[key] || key;

    if (shouldAdd(obj, excludeMap, exposeMap, beforeMap, afterMap, groupsMap, strategy, key, groups, version)) {
      if (Array.isArray(obj[key])) {
        json[name] = transformArray(obj[key], groups, version);
      } else if (isObject(obj[key])) {
        json[name] = transform(obj[key], groups, version);
      } else {
        json[name] = obj[key];
      }
    }

    return json;
  }, {});
}

function shouldAdd(
  obj: any, excludeMap: any, exposeMap: any, beforeMap: any, afterMap: any, groupsMap: any,
  strategy: ExclusionPolicy, key: string, groups?: string[], version?: string
) {
  const propGroups = groupsMap && groupsMap[key] ? groupsMap[key] : [];

  if (strategy === ExclusionPolicy.ALL &&
    (!exposeMap.hasOwnProperty(key) || !exposeMap[key].call(null, obj, key))) {
    return false;
  }

  if (excludeMap.hasOwnProperty(key) && excludeMap[key].call(null, obj, key)) {
    return false;
  }

  if (version && beforeMap.hasOwnProperty(key)) {
    return versionCompare(beforeMap[key], version) === 1;
  }

  if (version && afterMap.hasOwnProperty(key)) {
    return versionCompare(afterMap[key], version) <= 0;
  }

  if (groups && groups.length) {
    return groups.some((group: string) => !!~propGroups.indexOf(group));
  }

  return true;
}