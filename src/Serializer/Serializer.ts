import {ExcludeSymbol, ExposeSymbol} from '../consts';

function transform(obj: any, groups?: string[]) {
  const excludeList = Reflect.getMetadata(ExcludeSymbol, obj) || [];
  const excludeMap = excludeList.reduce((obj: any, { key, config }: any) => (obj[key] = config, obj), {});
  const exposeList = Reflect.getMetadata(ExposeSymbol, obj) || [];
  const exposeMap = exposeList.reduce((obj: any, { key, config }: any) => (obj[key] = config, obj), {});

  return Object.getOwnPropertyNames(obj).reduce((json: any, key: string) => {
      const name = exposeMap[key] && exposeMap[key].name ? exposeMap[key].name : key;

      if (!excludeMap.hasOwnProperty(key)) {
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