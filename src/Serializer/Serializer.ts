import {ExcludeSymbol} from '../consts';


export function serialize(obj: any) {
  const excludeList = Reflect.getMetadata(ExcludeSymbol, obj) || [];
  const excludeMap = excludeList.reduce((obj: any, { key, config }: any) => (obj[key] = config, obj), {});

  return Object.getOwnPropertyNames(obj).reduce((json: any, key: string) => {
    const name = excludeMap[key] && excludeMap[key].name ? excludeMap[key].name : key;

    if (!excludeMap.hasOwnProperty(key)) {
      json[name] = obj[key];
    }

    return json;
  }, {});
}
