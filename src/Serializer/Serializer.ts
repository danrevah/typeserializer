import {
  AfterSymbol, BeforeSymbol, ExcludeSymbol, ExclusionPolicy,
  ExposeSymbol, GroupsSymbol, NameSymbol, StrategySymbol
} from '../consts';
import {isObject, versionCompare} from '../helpers';

// @TODO: 1. Type decorator
// @TODO: 2. Deserialize
// @TODO: 3. Array serialize make sure it also supports deserialize them properly! exclude and everything..
// @TODO: 4. Array deserialize make sure it also supports deserialize them properly! exclude and everything..

export function serialize(obj: any, groups?: string[], version?: string) {
  return JSON.stringify(transform(obj, groups, version));
}

// -- Private --
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

    if (shouldAdd(excludeMap, exposeMap, beforeMap, afterMap, groupsMap, strategy, key, groups, version)) {
      if (isObject(obj[key])) {
        json[name] = transform(obj[key], groups);
      } else {
        json[name] = obj[key];
      }
    }

    return json;
  }, {});
}

function shouldAdd(
  excludeMap: any, exposeMap: any, beforeMap: any, afterMap: any, groupsMap: any,
  strategy: ExclusionPolicy, key: string, groups?: string[], version?: string
) {
  const propGroups = groupsMap && groupsMap[key] ? groupsMap[key] : [];

  if (strategy === ExclusionPolicy.ALL && (!exposeMap.hasOwnProperty(key) || !exposeMap[key].call(null))) {
    return false;
  }

  if (excludeMap.hasOwnProperty(key) && excludeMap[key].call(null)) {
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