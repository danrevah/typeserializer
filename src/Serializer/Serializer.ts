import {ExcludeSymbol, ExposeSymbol} from '../consts';

export function serialize(obj: any, groups?: string[]) {
  const excludeList = Reflect.getMetadata(ExcludeSymbol, obj) || [];
  const excludeMap = excludeList.reduce((obj: any, { key, config }: any) => (obj[key] = config, obj), {});
  const exposeList = Reflect.getMetadata(ExposeSymbol, obj) || [];
  const exposeMap = exposeList.reduce((obj: any, { key, config }: any) => (obj[key] = config, obj), {});

  return JSON.stringify(
    Object.getOwnPropertyNames(obj).reduce((json: any, key: string) => {
      const name = exposeMap[key] && exposeMap[key].name ? exposeMap[key].name : key;

      if (!excludeMap.hasOwnProperty(key)) {
        json[name] = obj[key];
      }

      return json;
    }, {})
  );
}
