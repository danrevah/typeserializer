import {AfterSymbol, BeforeSymbol, ExcludeSymbol, ExposeSymbol, GroupsSymbol} from '../consts';
import {versionCompare} from '../helpers';

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

  return Object.getOwnPropertyNames(obj).reduce((json: any, key: string) => {
    const name = exposeMap[key] && exposeMap[key].name ? exposeMap[key].name : key;

    if (shouldAdd(excludeMap, exposeMap, beforeMap, afterMap, groupsMap, key, groups, version)) {
      if (typeof obj[key] === 'object') {
        json[name] = transform(obj[key], groups);
      } else {
        json[name] = obj[key];
      }
    }

    return json;
  }, {});
}

function shouldAdd(
  excludeMap: any, exposeMap: any, beforeMap: any, afterMap: any,
  groupsMap: any, key: string, groups?: string[], version?: string
) {
  const propGroups = groupsMap && groupsMap[key] ? groupsMap[key] : [];

  if (excludeMap.hasOwnProperty(key)) {
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