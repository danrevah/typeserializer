import {
  AfterSymbol,
  BeforeSymbol,
  Detector,
  ExcludeSymbol,
  ExclusionPolicy,
  ExposeSymbol,
  GroupsSymbol,
  NameSymbol,
  SerializerSymbol,
  StrategySymbol,
} from '../consts';
import { isObject, versionCompare } from '../helpers';

export function serialize(obj: any, groups?: string[], version?: string) {
  if (Array.isArray(obj)) {
    return JSON.stringify(transformArray(obj, groups, version));
  }

  return JSON.stringify(transform(obj, groups, version));
}

// -- Private --
function transformArray(arr: any[], groups?: string[], version?: string, stack?: Set<any>): any {
  return arr.map((elm: any) => {
    return Array.isArray(elm) ? transformArray(elm, groups, version, stack) : transform(elm, groups, version, stack);
  });
}

function transform(obj: any, groups?: string[], version?: string, stack?: Set<any>) {
  const excludeMap = Reflect.getMetadata(ExcludeSymbol, obj) || {};
  const exposeMap = Reflect.getMetadata(ExposeSymbol, obj) || {};
  const groupsMap = Reflect.getMetadata(GroupsSymbol, obj) || {};
  const beforeMap = Reflect.getMetadata(BeforeSymbol, obj) || {};
  const afterMap = Reflect.getMetadata(AfterSymbol, obj) || {};
  const nameMap = Reflect.getMetadata(NameSymbol, obj) || {};
  const serializeMap = Reflect.getMetadata(SerializerSymbol, obj) || {};
  const strategy = Reflect.getMetadata(StrategySymbol, obj.constructor);

  const mySet = new Set(stack || []);

  if (mySet.has(obj)) {
    return Detector.CIRCULAR_REFERENCE;
  }

  mySet.add(obj);

  return Object.getOwnPropertyNames(obj).reduce((json: any, key: string) => {
    const name = nameMap[key] || key;

    if (shouldAdd(obj, excludeMap, exposeMap, beforeMap, afterMap, groupsMap, strategy, key, groups, version)) {
      if (typeof serializeMap[key] === 'function') {
        json[name] = serializeMap[key].call(null, obj[key], obj);
      } else if (Array.isArray(obj[key])) {
        json[name] = transformArray(obj[key], groups, version, mySet).filter(
          (elm: any) => elm !== Detector.CIRCULAR_REFERENCE
        );
      } else if (isObject(obj[key])) {
        const transformed = transform(obj[key], groups, version, mySet);
        if (transformed !== Detector.CIRCULAR_REFERENCE) {
          json[name] = transformed;
        }
      } else {
        json[name] = obj[key];
      }
    }

    return json;
  }, {});
}

function shouldAdd(
  obj: any,
  excludeMap: any,
  exposeMap: any,
  beforeMap: any,
  afterMap: any,
  groupsMap: any,
  strategy: ExclusionPolicy,
  key: string,
  groups?: string[],
  version?: string
) {
  const propGroups = groupsMap && groupsMap[key] ? groupsMap[key] : [];

  if (strategy === ExclusionPolicy.ALL && (!exposeMap.hasOwnProperty(key) || !exposeMap[key].call(null, obj, key))) {
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
