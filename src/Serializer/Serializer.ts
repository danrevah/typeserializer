import {ExcludeSymbol, ExposeSymbol, GroupsSymbol} from '../consts';

function shouldAdd(excludeMap: any, exposeMap: any, groupsMap: any, key: string, groups?: string[]) {
  const propGroups = groupsMap && groupsMap[key] ? groupsMap[key] : [];

  if (excludeMap.hasOwnProperty(key)) {
    return false;
  }

  if (groups && groups.length) {
    return groups.some((group: string) => !!~propGroups.indexOf(group));
  }

  return true;
}

function transform(obj: any, groups?: string[]) {
  const excludeMap = Reflect.getMetadata(ExcludeSymbol, obj) || {};
  const exposeMap = Reflect.getMetadata(ExposeSymbol, obj) || {};
  const groupsMap = Reflect.getMetadata(GroupsSymbol, obj) || {};

  return Object.getOwnPropertyNames(obj).reduce((json: any, key: string) => {
    const name = exposeMap[key] && exposeMap[key].name ? exposeMap[key].name : key;

      if (shouldAdd(excludeMap, exposeMap, groupsMap, key, groups)) {
        if (typeof obj[key] === 'object') {
          json[name] = transform(obj[key], groups);
        } else {
          json[name] = obj[key];
        }
      }

      return json;
    }, {});
}

export function serialize(obj: any, groups?: string[]) {
  return JSON.stringify(transform(obj, groups));
}